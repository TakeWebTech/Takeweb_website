import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('groups')
@UseGuards(JwtAuthGuard, RbacGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @Permissions('organization.read')
  findAll() { return this.groupsService.findAll(); }

  @Get(':id')
  @Permissions('organization.read')
  findOne(@Param('id') id: string) { return this.groupsService.findOne(id); }

  @Post()
  @Permissions('organization.manage')
  create(@Body() body: { name: string; groupId?: string; description?: string }) {
    return this.groupsService.create(body);
  }

  @Patch(':id')
  @Permissions('organization.manage')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; groupId?: string; description?: string; isActive?: boolean },
  ) {
    return this.groupsService.update(id, body);
  }

  @Delete(':id')
  @Permissions('organization.manage')
  remove(@Param('id') id: string) { return this.groupsService.remove(id); }
}
