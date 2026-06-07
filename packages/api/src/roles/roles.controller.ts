import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('roles')
@UseGuards(JwtAuthGuard, RbacGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Permissions
  @Post('permissions/seed')
  @Permissions('roles.manage')
  seedPermissions() { return this.rolesService.seedPermissions(); }

  @Get('permissions')
  @Permissions('roles.manage')
  findAllPermissions() { return this.rolesService.findAllPermissions(); }

  // Roles
  @Get()
  @Permissions('roles.manage')
  findAll() { return this.rolesService.findAllRoles(); }

  @Get(':id')
  @Permissions('roles.manage')
  findOne(@Param('id') id: string) { return this.rolesService.findOneRole(id); }

  @Post()
  @Permissions('roles.manage')
  create(@Body() body: { name: string; description?: string; permissionIds?: string[]; permissionEntries?: { permissionId: string; effect?: 'ALLOW' | 'DENY' }[] }) {
    return this.rolesService.createRole(body);
  }

  @Post('assignments')
  @Permissions('roles.manage')
  assignRole(@Body() body: { roleId: string; scopeType: 'ORGANIZATION' | 'GROUP' | 'TEAM' | 'USER'; scopeId?: string; userId?: string; isTemporary?: boolean; startsAt?: string; endsAt?: string }) {
    return this.rolesService.assignRole(body);
  }

  @Patch(':id')
  @Permissions('roles.manage')
  update(@Param('id') id: string, @Body() body: any) { return this.rolesService.updateRole(id, body); }

  @Delete(':id')
  @Permissions('roles.manage')
  remove(@Param('id') id: string) { return this.rolesService.deleteRole(id); }
}
