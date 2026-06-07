import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from './moderation.service';

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private moderationService: ModerationService
    ) {}

    private getWeekNumber(d: Date) {
        const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(copy.getUTCFullYear(),0,1));
        const weekNo = Math.ceil(( ( (copy.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
        return weekNo;
    }

    // ============ Workflows & Targets ============

    async getWorkflowTargets(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                team: { include: { members: true, lead: true, manager: true } },
                department: { include: { head: true, managers: true } },
                assignedProjects: { include: { members: true, leads: true } },
            }
        });

        if (!user) throw new NotFoundException('User not found');

        const settings = await this.getSettings();

        // 1. Team Members
        const teamMembers = user.team ? user.team.members.filter(m => m.id !== userId) : [];
        const teamLeads = user.team ? [user.team.lead, user.team.manager].filter(Boolean) : [];

        // 2. Project Leads
        const projectLeads = user.assignedProjects.flatMap(p => p.leads).filter(l => l.id !== userId);

        // 3. Department Leads
        const deptLeads = user.department ? [user.department.head, user.department.managers].filter(Boolean) : [];

        // 4. HR & Management
        const hrUsers = await this.prisma.user.findMany({
            where: { id: { in: settings.hrUserIds || [] }, isActive: true }
        });

        const managementUsers = await this.prisma.user.findMany({
            where: { id: { in: settings.managementUserIds || [] }, isActive: true }
        });

        // Deduplicate arrays
        const unique = (arr: any[]) => Array.from(new Map(arr.filter(Boolean).map(item => [item.id, item])).values());

        return {
            categories: {
                TEAM_MEMBER: unique(teamMembers),
                TEAM_LEAD: unique(teamLeads),
                PROJECT_LEAD: unique(projectLeads),
                DEPARTMENT_LEAD: unique(deptLeads),
                HR: unique(hrUsers),
                MANAGEMENT: unique(managementUsers)
            }
        };
    }

    // ============ Review Submission ============

    async createReview(reviewerId: string, data: { targetUserId: string, rating?: number, comment?: string, status: string, categoryId: string }) {
        if (reviewerId === data.targetUserId) throw new BadRequestException("You cannot review yourself");

        if (data.comment) {
            this.moderationService.validateText(data.comment, 'Review comment');
        }

        const now = new Date();
        const anonymousId = "Reviewer #" + Math.random().toString(36).substring(2, 6).toUpperCase();

        return this.prisma.review.create({
            data: {
                reviewerId,
                anonymousId,
                targetUserId: data.targetUserId,
                rating: data.status === 'SUBMITTED' ? data.rating : null,
                comment: data.status === 'SUBMITTED' ? data.comment : null,
                status: data.status,
                categoryId: data.categoryId,
                week: this.getWeekNumber(now),
                month: now.getMonth() + 1,
                year: now.getFullYear()
            }
        });
    }

    // ============ Company Feedback ============

    async submitCompanyFeedback(submitterId: string, data: { category: string, priority: string, content: string, isAnonymous: boolean }) {
        this.moderationService.validateText(data.content, 'Feedback content');

        return this.prisma.companyFeedback.create({
            data: {
                category: data.category,
                priority: data.priority,
                content: data.content,
                isAnonymous: data.isAnonymous,
                submitterId: data.isAnonymous ? null : submitterId
            }
        });
    }

    // ============ Admin Settings ============

    async getSettings() {
        let settings = await this.prisma.reviewSettings.findUnique({ where: { id: 'default' } });
        if (!settings) {
            settings = await this.prisma.reviewSettings.create({
                data: { id: 'default', managementUserIds: [], hrUserIds: [] }
            });
        }
        return settings;
    }

    async updateSettings(data: any) {
        return this.prisma.reviewSettings.upsert({
            where: { id: 'default' },
            create: { id: 'default', ...data },
            update: data
        });
    }

    async getReceivedReviewsAdmin(targetUserId?: string) {
        // Admin only function - returns real reviewer identities
        return this.prisma.review.findMany({
            where: targetUserId ? { targetUserId } : undefined,
            include: { reviewer: { select: { id: true, firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    // ============ Legacy / Existing Methods ============

    async getTargets(userId: string) {
        return this.prisma.user.findMany({
            where: { isActive: true, id: { not: userId } },
            select: { id: true, firstName: true, lastName: true, avatar: true, department: true }
        });
    }

    async getReceivedReviews(userId: string) {
        return this.prisma.review.findMany({
            where: { targetUserId: userId },
            select: {
                id: true,
                anonymousId: true,
                rating: true,
                comment: true,
                week: true,
                month: true,
                year: true,
                createdAt: true,
                status: true,
                categoryId: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getStats(userId: string) {
        const now = new Date();
        const currWeek = this.getWeekNumber(now);
        const currMonth = now.getMonth() + 1;
        const currYear = now.getFullYear();

        const getAvg = async (where: any) => {
            const res = await this.prisma.review.aggregate({
                where: { targetUserId: userId, status: 'SUBMITTED', ...where },
                _avg: { rating: true },
                _count: { id: true }
            });
            return { rating: res._avg.rating || 0, count: res._count.id };
        };

        const currentWeekStats = await getAvg({ year: currYear, week: currWeek });
        const lastWeekStats = await getAvg({ year: currWeek === 1 ? currYear - 1 : currYear, week: currWeek === 1 ? 52 : currWeek - 1 });
        
        const currentMonthStats = await getAvg({ year: currYear, month: currMonth });
        const lastMonthStats = await getAvg({ year: currMonth === 1 ? currYear - 1 : currYear, month: currMonth === 1 ? 12 : currMonth - 1 });

        return {
            currentWeek: currentWeekStats,
            lastWeek: lastWeekStats,
            currentMonth: currentMonthStats,
            lastMonth: lastMonthStats,
            currentRating: currentMonthStats.rating || lastMonthStats.rating || currentWeekStats.rating || 0
        };
    }
}
