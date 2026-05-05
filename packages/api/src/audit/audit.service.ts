import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId: string;
    userEmail: string;
    userRole: string;
    action: string;
    module: string;
    entityType?: string;
    entityId?: string;
    description?: string;
    changes?: any;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(query?: {
    userId?: string;
    module?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};
    if (query?.userId) where.userId = query.userId;
    if (query?.module) where.module = query.module;
    if (query?.action) where.action = query.action;

    if (query?.startDate || query?.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const page = query?.page || 1;
    const limit = query?.limit || 50;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalToday, totalAll, byModule, byAction] = await Promise.all([
      this.prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
      this.prisma.auditLog.count(),
      this.prisma.auditLog.groupBy({ by: ['module'], _count: true, orderBy: { _count: { module: 'desc' } }, take: 10 }),
      this.prisma.auditLog.groupBy({ by: ['action'], _count: true, orderBy: { _count: { action: 'desc' } }, take: 10 }),
    ]);

    return { totalToday, totalAll, byModule, byAction };
  }
}
