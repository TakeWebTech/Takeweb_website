import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  private slugify(value: string) {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  private async generateUniqueSlug(prefix: string) {
    let slug = prefix;
    let exists = await this.prisma.group.findUnique({ where: { slug } });
    while (exists) {
      const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
      slug = `${prefix}-${suffix}`.toLowerCase();
      exists = await this.prisma.group.findUnique({ where: { slug } });
    }
    return slug;
  }

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

  async create(data: { name: string; groupId?: string; description?: string }) {
    const trimmedGroupId = data.groupId?.trim();
    const baseSlug = trimmedGroupId ? this.slugify(trimmedGroupId) : 'grp';
    const slug = trimmedGroupId
      ? baseSlug
      : await this.generateUniqueSlug(baseSlug);

    const existing = await this.prisma.group.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Group with this ID already exists');

    return this.prisma.group.create({
      data: { name: data.name, slug, description: data.description },
    });
  }

  async update(id: string, data: { name?: string; groupId?: string; description?: string; isActive?: boolean }) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.groupId) {
      updateData.slug = this.slugify(data.groupId);
      const existing = await this.prisma.group.findFirst({ where: { slug: updateData.slug, NOT: { id } } });
      if (existing) throw new ConflictException('Group with this ID already exists');
    } else if (data.name) {
      updateData.slug = this.slugify(data.name);
    }
    return this.prisma.group.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.group.delete({ where: { id } });
  }
}
