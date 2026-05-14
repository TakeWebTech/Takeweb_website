import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_WIDGETS: Record<string, any[]> = {
  ADMIN: [
    { widgetId: 'stats-overview', x: 0, y: 0, w: 12, h: 2, locked: true },
    { widgetId: 'quick-actions', x: 0, y: 2, w: 8, h: 3, locked: false },
    { widgetId: 'notifications', x: 8, y: 2, w: 4, h: 3, locked: false },
    { widgetId: 'team-performance', x: 0, y: 5, w: 6, h: 3, locked: false },
    { widgetId: 'recent-activity', x: 6, y: 5, w: 6, h: 3, locked: false },
    { widgetId: 'company-holidays', x: 0, y: 8, w: 4, h: 3, locked: false },
    { widgetId: 'attendance-summary', x: 4, y: 8, w: 4, h: 3, locked: false },
    { widgetId: 'announcements', x: 8, y: 8, w: 4, h: 3, locked: false },
  ],
  EDITOR: [
    { widgetId: 'stats-overview', x: 0, y: 0, w: 12, h: 2, locked: true },
    { widgetId: 'quick-actions', x: 0, y: 2, w: 6, h: 3, locked: false },
    { widgetId: 'assigned-tasks', x: 6, y: 2, w: 6, h: 3, locked: false },
    { widgetId: 'recent-activity', x: 0, y: 5, w: 12, h: 3, locked: false },
  ],
  AUTHOR: [
    { widgetId: 'stats-overview', x: 0, y: 0, w: 12, h: 2, locked: true },
    { widgetId: 'assigned-tasks', x: 0, y: 2, w: 8, h: 3, locked: false },
    { widgetId: 'attendance-summary', x: 8, y: 2, w: 4, h: 3, locked: false },
    { widgetId: 'announcements', x: 0, y: 5, w: 12, h: 2, locked: false },
  ],
  VIEWER: [
    { widgetId: 'stats-overview', x: 0, y: 0, w: 12, h: 2, locked: true },
    { widgetId: 'announcements', x: 0, y: 2, w: 12, h: 3, locked: true },
    { widgetId: 'company-holidays', x: 0, y: 5, w: 12, h: 3, locked: false },
  ],
};

@Injectable()
export class DashboardConfigService {
  constructor(private prisma: PrismaService) {}

  async getLayout(userId: string) {
    const layout = await this.prisma.dashboardLayout.findFirst({
      where: { userId, isDefault: true },
    });

    if (layout) return layout;

    // Return default based on role
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    return {
      id: null,
      userId,
      name: 'Default',
      isDefault: true,
      widgets: DEFAULT_WIDGETS[user?.role || 'VIEWER'],
    };
  }

  async getAllLayouts(userId: string) {
    return this.prisma.dashboardLayout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveLayout(userId: string, data: { name?: string; widgets: any[]; isDefault?: boolean }) {
    const name = data.name || 'Default';

    return this.prisma.dashboardLayout.upsert({
      where: { userId_name: { userId, name } },
      update: { widgets: data.widgets, isDefault: data.isDefault ?? true },
      create: { userId, name, widgets: data.widgets, isDefault: data.isDefault ?? true },
    });
  }

  async deleteLayout(userId: string, name: string) {
    const layout = await this.prisma.dashboardLayout.findUnique({
      where: { userId_name: { userId, name } },
    });
    if (!layout) throw new NotFoundException('Layout not found');
    return this.prisma.dashboardLayout.delete({ where: { id: layout.id } });
  }

  getDefaultWidgets(role: string) {
    return DEFAULT_WIDGETS[role] || DEFAULT_WIDGETS.VIEWER;
  }

  getAvailableWidgets() {
    return [
      { id: 'stats-overview', name: 'Stats Overview', description: 'Key metrics at a glance', defaultSize: { w: 12, h: 2 } },
      { id: 'quick-actions', name: 'Quick Actions', description: 'Mark attendance, submit reports', defaultSize: { w: 8, h: 3 } },
      { id: 'notifications', name: 'Notification Center', description: 'Mentions, deadlines, alerts', defaultSize: { w: 4, h: 3 } },
      { id: 'assigned-tasks', name: 'Assigned Tasks', description: 'Your current task list', defaultSize: { w: 6, h: 3 } },
      { id: 'attendance-summary', name: 'Attendance Summary', description: 'Daily/monthly attendance', defaultSize: { w: 4, h: 3 } },
      { id: 'team-performance', name: 'Team Performance', description: 'Performance reviews & stats', defaultSize: { w: 6, h: 3 } },
      { id: 'recent-activity', name: 'Recent Activity', description: 'Latest system activity', defaultSize: { w: 6, h: 3 } },
      { id: 'company-holidays', name: 'Company Holidays', description: 'Upcoming holidays', defaultSize: { w: 4, h: 3 } },
      { id: 'announcements', name: 'Announcements', description: 'Company & team notes', defaultSize: { w: 4, h: 3 } },
      { id: 'work-schedule', name: 'Work Schedule', description: 'Your schedule & shifts', defaultSize: { w: 6, h: 3 } },
      { id: 'productivity-stats', name: 'Productivity Stats', description: 'Work activity metrics', defaultSize: { w: 6, h: 3 } },
    ];
  }
}
