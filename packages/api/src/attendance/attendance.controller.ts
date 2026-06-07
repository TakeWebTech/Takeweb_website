import { Controller, Get, Post, Body, UseGuards, Request, Query, Param, Patch } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Get('status')
    @Permissions('attendance.read')
    getStatus(@Request() req: any) {
        return this.attendanceService.getStatus(req.user.id);
    }

    @Post('punch-in')
    @Permissions('attendance.write')
    punchIn(@Request() req: any, @Body() body: any) {
        return this.attendanceService.punchIn(req.user.id, body);
    }

    @Post('punch-out')
    @Permissions('attendance.write')
    punchOut(@Request() req: any) {
        return this.attendanceService.punchOut(req.user.id);
    }

    // Legacy aliases (deprecated)
    @Post('check-in')
    @Permissions('attendance.write')
    checkIn(@Request() req: any, @Body() body: any) {
        return this.attendanceService.punchIn(req.user.id, body);
    }

    @Post('check-out')
    @Permissions('attendance.write')
    checkOut(@Request() req: any) {
        return this.attendanceService.punchOut(req.user.id);
    }

    @Get('history')
    @Permissions('attendance.read')
    getHistory(@Request() req: any) {
        return this.attendanceService.getHistory(req.user.id);
    }

    @Get('analytics')
    @Permissions('attendance.read')
    getAnalytics(@Request() req: any, @Query('employeeId') employeeId?: string) {
        return this.attendanceService.getAnalytics(req.user, employeeId);
    }

    @Get('overtime')
    @Permissions('attendance.read')
    getOvertime(@Request() req: any, @Query('employeeId') employeeId?: string) {
        return this.attendanceService.getOvertimeRequests(req.user, employeeId);
    }

    @Get('overtime/admin')
    @Permissions('attendance.approve')
    getOvertimeAdmin() {
        return this.attendanceService.getOvertimeRequestsAdmin();
    }

    @Post('overtime')
    @Permissions('attendance.write')
    createOvertime(@Request() req: any, @Body() body: any) {
        return this.attendanceService.createOvertimeRequest(req.user.id, body);
    }

    @Patch('overtime/:id')
    @Permissions('attendance.approve')
    reviewOvertime(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        return this.attendanceService.reviewOvertimeRequest(req.user, id, body?.status);
    }

    @Post('leave')
    @Permissions('attendance.write')
    applyLeave(@Request() req: any, @Body() body: any) {
        return this.attendanceService.applyLeave(req.user.id, body);
    }
}
