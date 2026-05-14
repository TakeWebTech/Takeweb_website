import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../roles/roles.service';
import { RulesService } from '../../rules/rules.service';

// Decorator to set required permissions on a controller or method
export const PERMISSIONS_KEY = 'permissions';
export interface RequiredPermission {
  module: string;
  accessType: string;
}

// Use as @Permissions({ module: 'employees', accessType: 'CREATE' })
import { SetMetadata } from '@nestjs/common';
export const Permissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
    private rulesService: RulesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions decorator, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Admin always has access
    if (user.role === 'ADMIN') return true;

    // Check each required permission
    for (const perm of requiredPermissions) {
      // First check rule engine
      const ruleResult = await this.rulesService.evaluateAccess(user.id, perm.module, perm.accessType);
      if (!ruleResult.allowed) {
        throw new ForbiddenException(`Access denied: ${ruleResult.reason}`);
      }

      // Then check role permissions
      const hasPermission = await this.rolesService.checkPermission(user.id, perm.module, perm.accessType);
      if (!hasPermission) {
        throw new ForbiddenException(`Insufficient permissions for ${perm.module}:${perm.accessType}`);
      }
    }

    return true;
  }
}
