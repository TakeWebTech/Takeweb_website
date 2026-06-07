import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { level?: string; groupId?: string; teamId?: string; module?: string }) {
    const where: any = {};
    if (query?.level) where.level = query.level;
    if (query?.groupId) where.groupId = query.groupId;
    if (query?.teamId) where.teamId = query.teamId;
    if (query?.module) where.module = query.module;

    return this.prisma.rule.findMany({
      where,
      include: {
        group: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.rule.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!rule) throw new NotFoundException('Rule not found');
    return rule;
  }

  async create(data: {
    name: string; description?: string; level: string; groupId?: string; teamId?: string; userId?: string;
    module: string; accessType: string; effect?: string; conditions?: any; priority?: number;
  }) {
    return this.prisma.rule.create({
      data: {
        name: data.name,
        description: data.description,
        level: data.level as any,
        groupId: data.groupId,
        teamId: data.teamId,
        userId: data.userId,
        module: data.module,
        accessType: data.accessType as any,
        effect: data.effect || 'DENY',
        conditions: data.conditions,
        priority: data.priority || 0,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.rule.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rule.delete({ where: { id } });
  }

  // ─── Rule Evaluation Engine ───
  async evaluateAccess(userId: string, module: string, accessType: string): Promise<{ allowed: boolean; reason?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, groupId: true, teamId: true },
    });

    if (!user) return { allowed: false, reason: 'User not found' };
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return { allowed: true, reason: 'Admin bypass' };

    // Fetch applicable rules (individual > team > group, highest priority first)
    const rules = await this.prisma.rule.findMany({
      where: {
        isActive: true,
        module,
        accessType: accessType as any,
        OR: [
          { level: 'INDIVIDUAL', userId: user.id },
          ...(user.teamId ? [{ level: 'TEAM' as any, teamId: user.teamId }] : []),
          ...(user.groupId ? [{ level: 'GROUP' as any, groupId: user.groupId }] : []),
        ],
      },
      orderBy: [
        { level: 'asc' }, // INDIVIDUAL first
        { priority: 'desc' },
      ],
    });

    if (rules.length === 0) return { allowed: true, reason: 'No rules — default allow' };

    // First matching rule wins
    const rule = rules[0];
    return {
      allowed: rule.effect === 'ALLOW',
      reason: `Rule "${rule.name}" (${rule.level}): ${rule.effect}`,
    };
  }
}
