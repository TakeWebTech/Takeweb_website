import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessType, Role } from '@prisma/client';
import { PERMISSIONS_KEY, PermissionKey } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

const BUILT_IN_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  MANAGER: [
    'dashboard.read',
    'dashboard.write',
    'employee.read',
    'attendance.read',
    'attendance.write',
    'attendance.approve',
    'review.read',
    'review.write',
    'notification.read',
    'notification.write',
    'project.read',
    'service.read',
    'blog.read',
    'career.read',
    'contact.read',
  ],
  EMPLOYEE: [
    'dashboard.read',
    'dashboard.write',
    'profile.read',
    'profile.write',
    'attendance.read',
    'attendance.write',
    'review.read',
    'review.write',
    'notification.read',
  ],
  EDITOR: [
    'dashboard.read',
    'blog.read',
    'blog.write',
    'service.read',
    'service.write',
    'project.read',
    'project.write',
    'career.read',
    'career.write',
    'contact.read',
    'media.read',
    'media.write',
    'page.read',
    'page.write',
    'testimonial.read',
    'testimonial.write',
  ],
  AUTHOR: ['dashboard.read', 'blog.read', 'blog.write', 'project.read', 'project.write', 'media.read'],
  VIEWER: ['dashboard.read', '*.read'],
};

const MODULE_ALIASES: Record<string, string[]> = {
  employee: ['employee', 'employees'],
  service: ['service', 'services'],
  project: ['project', 'projects'],
  career: ['career', 'careers'],
  review: ['review', 'reviews'],
  notification: ['notification', 'notifications'],
  role: ['role', 'roles'],
  organization: ['organization', 'groups', 'teams', 'twadmin'],
};

const ACTION_TO_ACCESS_TYPE: Record<string, AccessType> = {
  read: AccessType.VIEW,
  write: AccessType.EDIT,
  create: AccessType.CREATE,
  edit: AccessType.EDIT,
  delete: AccessType.DELETE,
  manage: AccessType.FULL_ACCESS,
  approve: AccessType.APPROVE,
  export: AccessType.EXPORT,
};

function splitPermission(permission: string) {
  const [module, action = 'read'] = permission.split('.');
  return { module, action };
}

function moduleCandidates(module: string) {
  return MODULE_ALIASES[module] || [module];
}

function roleAllows(role: Role | string, permission: PermissionKey) {
  const grants = BUILT_IN_PERMISSIONS[role] || [];
  if (grants.includes('*')) return true;
  if (grants.includes(permission)) return true;

  const { module, action } = splitPermission(permission);
  if (action === 'read' && grants.includes('*.read')) return true;
  return grants.includes(`${module}.manage`);
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionKey[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('Authentication required');
    }

    for (const permission of requiredPermissions) {
      const allowed = await this.hasPermission(user.id, user.role, permission);
      if (!allowed) {
        throw new ForbiddenException(`Missing required permission: ${permission}`);
      }
    }

    return true;
  }

  private async hasPermission(userId: string, role: Role | string, permission: PermissionKey) {
    if (roleAllows(role, permission)) return true;

    const { module, action } = splitPermission(permission);
    const modules = moduleCandidates(module);
    const accessType = ACTION_TO_ACCESS_TYPE[action] || AccessType.VIEW;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        groupId: true,
        teamId: true,
        customRole: {
          select: {
            permissions: {
              select: {
                effect: true,
                permission: { select: { key: true, module: true, accessType: true } },
              },
            },
          },
        },
        roleAssignments: {
          where: {
            OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
          },
          select: {
            scopeType: true,
            scopeId: true,
            userId: true,
            role: {
              select: {
                permissions: {
                  select: {
                    effect: true,
                    permission: { select: { key: true, module: true, accessType: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return false;

    const scopedRules = await this.prisma.rule.findMany({
      where: {
        isActive: true,
        module: { in: modules },
        accessType,
        OR: [
          { level: 'INDIVIDUAL', userId: user.id },
          ...(user.teamId ? [{ level: 'TEAM' as const, teamId: user.teamId }] : []),
          ...(user.groupId ? [{ level: 'GROUP' as const, groupId: user.groupId }] : []),
        ],
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    const denyRule = scopedRules.find((rule) => rule.effect === 'DENY');
    if (denyRule) return false;
    const allowRule = scopedRules.find((rule) => rule.effect === 'ALLOW');
    if (allowRule) return true;

    const directPermissions = user.customRole?.permissions || [];
    const assignmentPermissions = user.roleAssignments
      .filter((assignment) => {
        if (assignment.scopeType === 'ORGANIZATION') return true;
        if (assignment.scopeType === 'GROUP') return assignment.scopeId === user.groupId;
        if (assignment.scopeType === 'TEAM') return assignment.scopeId === user.teamId;
        if (assignment.scopeType === 'USER') return assignment.userId === user.id || assignment.scopeId === user.id;
        return false;
      })
      .flatMap((assignment) => assignment.role.permissions);

    const allPermissions = [...directPermissions, ...assignmentPermissions];

    const matches = allPermissions.filter(({ permission: stored }) => {
      const storedKey = stored.key || `${stored.module}.${String(stored.accessType).toLowerCase()}`;
      return (
        storedKey === permission ||
        modules.some((candidate) => storedKey === `${candidate}.manage`) ||
        (action === 'read' && storedKey === '*.read') ||
        (modules.includes(stored.module) && stored.accessType === accessType)
      );
    });

    if (matches.some((entry) => entry.effect === 'DENY')) return false;
    return matches.some((entry) => entry.effect === 'ALLOW');
  }
}
