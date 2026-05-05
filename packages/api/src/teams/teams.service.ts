import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(groupId?: string) {
    return this.prisma.team.findMany({
      where: groupId ? { groupId } : undefined,
      include: {
        group: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        lead: { select: { id: true, firstName: true, lastName: true, email: true } },
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        lead: { select: { id: true, firstName: true, lastName: true, email: true } },
        members: { select: { id: true, firstName: true, lastName: true, email: true, role: true, workType: true } },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async create(data: { name: string; groupId: string; description?: string; managerId?: string; leadId?: string }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.team.create({
      data: { name: data.name, slug, groupId: data.groupId, description: data.description, managerId: data.managerId, leadId: data.leadId },
    });
  }

  async update(id: string, data: { name?: string; description?: string; managerId?: string; leadId?: string; isActive?: boolean }) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.name) updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.team.update({ where: { id }, data: updateData });
  }

  async addMember(teamId: string, userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { teamId } });
  }

  async removeMember(teamId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.teamId !== teamId) throw new NotFoundException('User not in this team');
    return this.prisma.user.update({ where: { id: userId }, data: { teamId: null } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.team.delete({ where: { id } });
  }
}
