import { Injectable, NotFoundException } from '@nestjs/common';
import { RuleLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const PERMISSION_CATALOG: Record<string, string[]> = {
  dashboard: ['VIEW'],
  profile: ['VIEW', 'EDIT'],
  users: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ACCESS'],
  employees: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'ASSIGN', 'EXPORT'],
  salary: ['VIEW', 'EDIT', 'ASSIGN', 'APPROVE', 'EXPORT'],
  attendance: ['VIEW', 'EDIT', 'APPROVE', 'EXPORT'],
  reviews: ['VIEW', 'EDIT', 'APPROVE', 'EXPORT'],
  projects: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  services: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  blog: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  careers: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  contact: ['VIEW', 'EDIT', 'EXPORT'],
  media: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  pages: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  testimonials: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  notifications: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  team: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  settings: ['VIEW', 'EDIT'],
  seo: ['VIEW', 'EDIT', 'EXPORT', 'FULL_ACCESS'],
  reports: ['VIEW', 'EXPORT'],
  roles: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ACCESS'],
  rules: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ACCESS'],
  audit: ['VIEW', 'EXPORT'],
  organization: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ACCESS'],
  twadmin: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'FULL_ACCESS'],
};

const ACCESS_TYPES = Array.from(new Set(Object.values(PERMISSION_CATALOG).flat()));

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  private buildKey(module: string, accessType: string) {
    return `${module}.${accessType.toLowerCase()}`;
  }

  // ─── Permissions ───
  async seedPermissions() {
    const perms: { module: string; accessType: any; key: string }[] = [];
    for (const [mod, actions] of Object.entries(PERMISSION_CATALOG)) {
      for (const access of actions) {
        perms.push({ module: mod, accessType: access, key: this.buildKey(mod, access) });
      }
    }
    for (const perm of perms) {
      await this.prisma.permission.upsert({
        where: { module_accessType: { module: perm.module, accessType: perm.accessType } },
        update: {},
        create: { key: perm.key, module: perm.module, accessType: perm.accessType, description: `${perm.accessType} access to ${perm.module}` },
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

  async createRole(data: { name: string; description?: string; permissionIds?: string[]; permissionEntries?: { permissionId: string; effect?: 'ALLOW' | 'DENY' }[] }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.customRole.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        permissions: data.permissionEntries
          ? { create: data.permissionEntries.map(p => ({ permissionId: p.permissionId, effect: p.effect || 'ALLOW' })) }
          : data.permissionIds
            ? { create: data.permissionIds.map(pid => ({ permissionId: pid, effect: 'ALLOW' })) }
            : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async updateRole(id: string, data: { name?: string; description?: string; isActive?: boolean; permissionIds?: string[]; permissionEntries?: { permissionId: string; effect?: 'ALLOW' | 'DENY' }[] }) {
    await this.findOneRole(id);

    if (data.permissionEntries || data.permissionIds) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
      await this.prisma.rolePermission.createMany({
        data: data.permissionEntries
          ? data.permissionEntries.map(p => ({ roleId: id, permissionId: p.permissionId, effect: p.effect || 'ALLOW' }))
          : data.permissionIds
            ? data.permissionIds.map(pid => ({ roleId: id, permissionId: pid, effect: 'ALLOW' }))
            : [],
      });
    }

    const { permissionIds, permissionEntries, ...updateData } = data as any;
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

  // ─── Role Assignments ───
  async assignRole(data: {
    roleId: string;
    scopeType: 'ORGANIZATION' | 'GROUP' | 'TEAM' | 'USER';
    scopeId?: string;
    userId?: string;
    isTemporary?: boolean;
    startsAt?: string;
    endsAt?: string;
  }) {
    const scopeType = data.scopeType || 'ORGANIZATION';
    const userId = scopeType === 'USER' ? (data.userId || data.scopeId) : data.userId;
    return this.prisma.userRole.create({
      data: {
        roleId: data.roleId,
        scopeType,
        scopeId: data.scopeId,
        userId: userId || undefined,
        isTemporary: !!data.isTemporary,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      },
    });
  }

  // ─── Permission Checking ───
  async checkPermission(userId: string, module: string, accessType: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customRole: {
          include: { permissions: { include: { permission: true } } },
        },
        roleAssignments: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (!user) return false;

    const permissionKey = this.buildKey(module, accessType);

    // Rules: explicit deny overrides allow
    const rules = await this.prisma.rule.findMany({
      where: {
        isActive: true,
        module,
        accessType: accessType as any,
        OR: [
          { level: RuleLevel.INDIVIDUAL, userId: user.id },
          ...(user.teamId ? [{ level: RuleLevel.TEAM, teamId: user.teamId }] : []),
          ...(user.groupId ? [{ level: RuleLevel.GROUP, groupId: user.groupId }] : []),
        ],
      },
      orderBy: { priority: 'desc' },
    });

    for (const rule of rules) {
      if (rule.effect === 'DENY') return false;
      if (rule.effect === 'ALLOW') return true;
    }

    // Built-in administrator bypass
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;

    const rolePerms: { key: string; effect: string }[] = [];

    if (user.customRole) {
      user.customRole.permissions.forEach(rp => {
        rolePerms.push({ key: rp.permission.key || this.buildKey(rp.permission.module, rp.permission.accessType as any), effect: rp.effect || 'ALLOW' });
      });
    }

    const assignmentPerms = user.roleAssignments
      .filter(a => {
        if (a.scopeType === 'ORGANIZATION') return true;
        if (a.scopeType === 'GROUP') return !!user.groupId && a.scopeId === user.groupId;
        if (a.scopeType === 'TEAM') return !!user.teamId && a.scopeId === user.teamId;
        if (a.scopeType === 'USER') return a.userId === user.id || a.scopeId === user.id;
        return false;
      })
      .flatMap(a => a.role.permissions.map(rp => ({ key: rp.permission.key || this.buildKey(rp.permission.module, rp.permission.accessType as any), effect: rp.effect || 'ALLOW' })));

    rolePerms.push(...assignmentPerms);

    const hasDeny = rolePerms.some(p => p.key === permissionKey && p.effect === 'DENY');
    if (hasDeny) return false;

    const hasAllow = rolePerms.some(p => p.key === permissionKey && p.effect === 'ALLOW');
    if (hasAllow) return true;

    // Default role fallback
    const defaultPermissions: Record<string, string[]> = {
      MANAGER: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
      EMPLOYEE: ['VIEW'],
      EDITOR: ['VIEW', 'CREATE', 'EDIT'],
      AUTHOR: ['VIEW', 'CREATE'],
      VIEWER: ['VIEW'],
    };

    return defaultPermissions[user.role]?.includes(accessType) || false;
  }
}
