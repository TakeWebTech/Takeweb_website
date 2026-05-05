import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        teams: { select: { id: true, name: true, _count: { select: { members: true } } } },
        _count: { select: { members: true, teams: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            manager: { select: { id: true, firstName: true, lastName: true } },
            lead: { select: { id: true, firstName: true, lastName: true } },
            _count: { select: { members: true } },
          },
        },
        members: { select: { id: true, firstName: true, lastName: true, email: true, role: true, workType: true } },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async create(data: { name: string; description?: string }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await this.prisma.group.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Group with this name already exists');

    return this.prisma.group.create({
      data: { name: data.name, slug, description: data.description },
    });
  }

  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    return this.prisma.group.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.group.delete({ where: { id } });
  }
}
