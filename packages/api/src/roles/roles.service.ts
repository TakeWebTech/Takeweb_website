import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MODULES = ['dashboard', 'employees', 'projects', 'services', 'blog', 'careers', 'contact', 'media', 'team', 'settings', 'seo', 'reports', 'reviews', 'twadmin'];
const ACCESS_TYPES = ['VIEW', 'CREATE', 'EDIT', 'DELETE'];

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  // ─── Permissions ───
  async seedPermissions() {
    const perms: { module: string; accessType: any }[] = [];
    for (const mod of MODULES) {
      for (const access of ACCESS_TYPES) {
        perms.push({ module: mod, accessType: access });
      }
    }
    for (const perm of perms) {
      await this.prisma.permission.upsert({
        where: { module_accessType: { module: perm.module, accessType: perm.accessType } },
        update: {},
        create: { module: perm.module, accessType: perm.accessType, description: `${perm.accessType} access to ${perm.module}` },
      });
    }
    return { seeded: perms.length };
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { accessType: 'asc' }] });
  }

  // ─── Custom Roles ───
  async findAllRoles() {
    return this.prisma.customRole.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOneRole(id: string) {
    const role = await this.prisma.customRole.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        users: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async createRole(data: { name: string; description?: string; permissionIds?: string[] }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.customRole.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        permissions: data.permissionIds ? {
          create: data.permissionIds.map(pid => ({ permissionId: pid })),
        } : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async updateRole(id: string, data: { name?: string; description?: string; isActive?: boolean; permissionIds?: string[] }) {
    await this.findOneRole(id);

    if (data.permissionIds) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
      await this.prisma.rolePermission.createMany({
        data: data.permissionIds.map(pid => ({ roleId: id, permissionId: pid })),
      });
    }

    const { permissionIds, ...updateData } = data;
    if (updateData.name) (updateData as any).slug = updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return this.prisma.customRole.update({
      where: { id },
      data: updateData,
      include: { permissions: { include: { permission: true } } },
    });
  }

  async deleteRole(id: string) {
    await this.findOneRole(id);
    return this.prisma.customRole.delete({ where: { id } });
  }

  // ─── Permission Checking ───
  async checkPermission(userId: string, module: string, accessType: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customRole: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    if (!user) return false;

    // Super admin bypass
    if (user.role === 'ADMIN') return true;

    // Check custom role permissions
    if (user.customRole) {
      return user.customRole.permissions.some(
        rp => rp.permission.module === module && rp.permission.accessType === accessType,
      );
    }

    // Default role fallback
    const defaultPermissions: Record<string, string[]> = {
      EDITOR: ['VIEW', 'CREATE', 'EDIT'],
      AUTHOR: ['VIEW', 'CREATE'],
      VIEWER: ['VIEW'],
    };

    return defaultPermissions[user.role]?.includes(accessType) || false;
  }
}
