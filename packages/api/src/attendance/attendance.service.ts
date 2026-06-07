import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_SHIFT_START = '09:00';
const DEFAULT_SHIFT_END = '18:00';
const DEFAULT_GRACE_BEFORE_MINUTES = 15;
const DEFAULT_GRACE_AFTER_MINUTES = 30;
const DEFAULT_LATE_GRACE_MINUTES = 15;

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) {}

    private parseTimeToDate(base: Date, timeValue: string) {
        const [h, m] = timeValue.split(':').map((n) => Number(n));
        if (Number.isNaN(h) || Number.isNaN(m)) {
            throw new BadRequestException('Invalid shift time format. Expected HH:mm.');
        }
        const d = new Date(base);
        d.setHours(h, m, 0, 0);
        return d;
    }

    private async getShiftConfig(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                shiftStart: true,
                shiftEnd: true,
                shiftGraceBeforeMinutes: true,
                shiftGraceAfterMinutes: true,
                lateGraceMinutes: true,
            },
        });

        if (!user) throw new NotFoundException('Employee not found');

        return {
            shiftStart: user.shiftStart || DEFAULT_SHIFT_START,
            shiftEnd: user.shiftEnd || DEFAULT_SHIFT_END,
            graceBeforeMinutes: user.shiftGraceBeforeMinutes ?? DEFAULT_GRACE_BEFORE_MINUTES,
            graceAfterMinutes: user.shiftGraceAfterMinutes ?? DEFAULT_GRACE_AFTER_MINUTES,
            lateGraceMinutes: user.lateGraceMinutes ?? DEFAULT_LATE_GRACE_MINUTES,
        };
    }

    private getShiftRange(baseDate: Date, config: { shiftStart: string; shiftEnd: string }) {
        const shiftStartAt = this.parseTimeToDate(baseDate, config.shiftStart);
        let shiftEndAt = this.parseTimeToDate(baseDate, config.shiftEnd);
        if (shiftEndAt.getTime() <= shiftStartAt.getTime()) {
            shiftEndAt.setDate(shiftEndAt.getDate() + 1);
        }
        return { shiftStartAt, shiftEndAt };
    }

    private getPunchInWindow(now: Date, config: { shiftStart: string; graceBeforeMinutes: number; graceAfterMinutes: number; lateGraceMinutes: number }) {
        const shiftStartAt = this.parseTimeToDate(now, config.shiftStart);
        const allowedStart = new Date(shiftStartAt.getTime() - config.graceBeforeMinutes * 60000);
        const allowedEnd = new Date(shiftStartAt.getTime() + config.graceAfterMinutes * 60000);
        const lateAfter = new Date(shiftStartAt.getTime() + config.lateGraceMinutes * 60000);
        return { shiftStartAt, allowedStart, allowedEnd, lateAfter };
    }

    async getStatus(userId: string) {
        const active = await this.prisma.attendance.findFirst({
            where: { employeeId: userId, status: 'ACTIVE' },
        });
        return active || { status: 'NONE' };
    }

    async punchIn(userId: string, data: any) {
        if (data?.latitude === undefined || data?.latitude === null || data?.longitude === undefined || data?.longitude === null) {
            throw new BadRequestException('Location (latitude and longitude) is required for punch-in');
        }

        const existing = await this.prisma.attendance.findFirst({
            where: { employeeId: userId, status: 'ACTIVE' },
        });
        if (existing) throw new BadRequestException('Already punched in');

        const config = await this.getShiftConfig(userId);
        const now = new Date();
        const { allowedStart, lateAfter } = this.getPunchInWindow(now, config);
        const { shiftEndAt } = this.getShiftRange(now, config);

        if (now < allowedStart || now > shiftEndAt) {
            throw new BadRequestException('Punch-In is only allowed during your assigned working hours.');
        }

        const isLate = now > lateAfter;
        const lateByMinutes = isLate ? Math.max(1, Math.ceil((now.getTime() - lateAfter.getTime()) / 60000)) : null;

        return this.prisma.attendance.create({
            data: {
                employeeId: userId,
                checkinTime: now,
                latitude: data.latitude,
                longitude: data.longitude,
                punchInAccuracy: data.accuracy ?? null,
                isLate,
                lateByMinutes,
            },
        });
    }

    async punchOut(userId: string) {
        const active = await this.prisma.attendance.findFirst({
            where: { employeeId: userId, status: 'ACTIVE' },
        });
        if (!active) throw new BadRequestException('Not punched in');

        const checkoutTime = new Date();
        const diffMs = checkoutTime.getTime() - active.checkinTime.getTime();
        const workingHours = diffMs / 3600000; // in hours
        const config = await this.getShiftConfig(userId);
        const { shiftStartAt, shiftEndAt } = this.getShiftRange(active.checkinTime, config);
        const shiftDurationHours = Math.max(0, (shiftEndAt.getTime() - shiftStartAt.getTime()) / 3600000);
        const earlyCheckout = shiftDurationHours > 0 ? workingHours < shiftDurationHours : workingHours < 8;

        return this.prisma.attendance.update({
            where: { id: active.id },
            data: {
                checkoutTime,
                workingHours,
                status: 'COMPLETED',
                earlyCheckout,
            },
        });
    }

    async getHistory(userId: string) {
        return this.prisma.attendance.findMany({
            where: { employeeId: userId },
            orderBy: { checkinTime: 'desc' },
            take: 30, // Last 30 records
        });
    }

    async applyLeave(userId: string, data: { startDate: string, endDate: string, reason: string }) {
        if (!data.startDate || !data.endDate || !data.reason) {
            throw new BadRequestException('Start date, end date, and reason are required');
        }
        return this.prisma.leaveRequest.create({
            data: {
                employeeId: userId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
                status: 'PENDING',
            }
        });
    }

    async getAnalytics(requestUser: { id: string; role?: string }, employeeId?: string) {
        if (employeeId && employeeId !== requestUser.id && requestUser.role !== 'ADMIN') {
            throw new ForbiddenException('Not allowed to view attendance analytics for this employee');
        }

        const targetId = employeeId || requestUser.id;
        const config = await this.getShiftConfig(targetId);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const records = await this.prisma.attendance.findMany({
            where: {
                employeeId: targetId,
                checkinTime: { gte: startOfMonth, lte: endOfMonth },
            },
            orderBy: { checkinTime: 'asc' },
        });

        const approvedOvertime = await this.prisma.overtimeRequest.findMany({
            where: {
                employeeId: targetId,
                status: 'APPROVED',
                date: { gte: startOfMonth, lte: endOfMonth },
            },
        });

        const totalWorkingDays = this.countWorkingDays(startOfMonth, endOfMonth);
        const completed = records.filter((r) => r.status !== 'ACTIVE');
        const uniqueCompletedDays = new Set(completed.map((r) => r.checkinTime.toISOString().slice(0, 10)));

        const lateCount = completed.filter((r) => r.isLate).length;
        const halfDayCount = completed.filter((r) => r.earlyCheckout).length;
        const presentDays = Math.max(0, uniqueCompletedDays.size - lateCount - halfDayCount);
        const absentDays = Math.max(0, totalWorkingDays - uniqueCompletedDays.size);

        const holidayWorkDays = completed.filter((r) => {
            const day = new Date(r.checkinTime).getDay();
            return day === 0 || day === 6;
        }).length;

        const { shiftStartAt, shiftEndAt } = this.getShiftRange(now, config);
        const shiftDurationHours = Math.max(0, (shiftEndAt.getTime() - shiftStartAt.getTime()) / 3600000);
        const overtimeHours = completed.reduce((sum, r) => {
            if (!r.workingHours || shiftDurationHours <= 0) return sum;
            return sum + Math.max(0, r.workingHours - shiftDurationHours);
        }, 0);

        const approvedOvertimeHours = approvedOvertime.reduce((sum, r) => sum + (r.hours || 0), 0);

        return {
            period: { from: startOfMonth, to: endOfMonth },
            totalWorkingDays,
            presentDays,
            absentDays,
            lateCount,
            halfDayCount,
            overtimeHours,
            approvedOvertimeHours,
            holidayWorkDays,
            shiftDurationHours,
        };
    }

    private countWorkingDays(start: Date, end: Date) {
        let count = 0;
        const cur = new Date(start);
        while (cur <= end) {
            const day = cur.getDay();
            if (day !== 0 && day !== 6) count += 1;
            cur.setDate(cur.getDate() + 1);
        }
        return count;
    }

    async createOvertimeRequest(userId: string, data: { date: string; hours: number; reason: string; attachmentUrl?: string }) {
        if (!data.date || !data.reason) {
            throw new BadRequestException('Date, extra hours, and reason are required');
        }
        if (!data.hours || data.hours <= 0) {
            throw new BadRequestException('Extra hours must be greater than 0');
        }

        return this.prisma.overtimeRequest.create({
            data: {
                employeeId: userId,
                date: new Date(data.date),
                hours: data.hours,
                reason: data.reason,
                attachmentUrl: data.attachmentUrl || null,
                status: 'PENDING',
            },
        });
    }

    async getOvertimeRequests(requestUser: { id: string; role?: string }, employeeId?: string) {
        if (employeeId && employeeId !== requestUser.id && requestUser.role !== 'ADMIN') {
            throw new ForbiddenException('Not allowed to view overtime requests for this employee');
        }
        const targetId = employeeId || requestUser.id;
        return this.prisma.overtimeRequest.findMany({
            where: { employeeId: targetId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getOvertimeRequestsAdmin() {
        return this.prisma.overtimeRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                employee: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
    }

    async reviewOvertimeRequest(reviewer: { id: string; role?: string }, id: string, status: string) {
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            throw new BadRequestException('Invalid status');
        }

        return this.prisma.overtimeRequest.update({
            where: { id },
            data: {
                status,
                reviewedById: reviewer.id,
                reviewedAt: new Date(),
            },
        });
    }
}
