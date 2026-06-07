import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async getNotifications(user: any) {
        // Find notifications where:
        // 1. type is GENERAL or ORGANIZATION
        // 2. OR type is DEPARTMENT and departmentId matches user's group/department
        // 3. OR type is TEAM and teamId matches user's team
        // We'll also fetch read status.
        
        const notifications = await this.prisma.notification.findMany({
            where: {
                OR: [
                    { type: 'ORGANIZATION' },
                    { type: 'GENERAL' },
                    { type: 'DEPARTMENT', departmentId: user.groupId },
                    { type: 'TEAM', teamId: user.teamId }
                ]
            },
            include: {
                reads: {
                    where: { userId: user.id }
                },
                createdBy: {
                    select: { firstName: true, lastName: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return notifications.map(n => ({
            ...n,
            isRead: n.reads.length > 0
        }));
    }

    async createNotification(data: { title: string, message: string, type: NotificationType, departmentId?: string, teamId?: string }, userId: string) {
        return this.prisma.notification.create({
            data: {
                ...data,
                createdById: userId,
            }
        });
    }

    async markAsRead(notificationId: string, userId: string) {
        return this.prisma.notificationRead.upsert({
            where: {
                userId_notificationId: { userId, notificationId }
            },
            create: {
                userId,
                notificationId
            },
            update: {}
        });
    }
}
