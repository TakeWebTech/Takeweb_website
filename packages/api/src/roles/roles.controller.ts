import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Permissions
  @Post('permissions/seed')
  seedPermissions() { return this.rolesService.seedPermissions(); }

  @Get('permissions')
  findAllPermissions() { return this.rolesService.findAllPermissions(); }

  // Roles
  @Get()
  findAll() { return this.rolesService.findAllRoles(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.rolesService.findOneRole(id); }

  @Post()
  create(@Body() body: { name: string; description?: string; permissionIds?: string[] }) {
    return this.rolesService.createRole(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.rolesService.updateRole(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.rolesService.deleteRole(id); }
}
