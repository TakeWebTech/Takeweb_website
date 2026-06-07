import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';
import { NotificationType } from '@prisma/client';

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @Permissions('notification.read')
    getNotifications(@Request() req: any) {
        return this.notificationsService.getNotifications(req.user);
    }

    @Post()
    @Permissions('notification.write')
    createNotification(@Request() req: any, @Body() body: { title: string, message: string, type: NotificationType, departmentId?: string, teamId?: string }) {
        // Here we could add Role-based validation
        // Admin: can create any
        // Manager: can create DEPARTMENT and TEAM
        // Lead: can create TEAM
        return this.notificationsService.createNotification(body, req.user.id);
    }

    @Patch(':id/read')
    @Permissions('notification.read')
    markAsRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }
}
