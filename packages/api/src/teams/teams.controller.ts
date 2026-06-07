import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('teams')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Permissions('organization.read')
  findAll(@Query('groupId') groupId?: string) { return this.teamsService.findAll(groupId); }

  @Get(':id')
  @Permissions('organization.read')
  findOne(@Param('id') id: string) { return this.teamsService.findOne(id); }

  @Post()
  @Permissions('organization.manage')
  create(@Body() body: { name: string; groupId: string; description?: string; managerId?: string; leadId?: string }) {
    return this.teamsService.create(body);
  }

  @Patch(':id')
  @Permissions('organization.manage')
  update(@Param('id') id: string, @Body() body: any) { return this.teamsService.update(id, body); }

  @Post(':id/members/:userId')
  @Permissions('organization.manage')
  addMember(@Param('id') id: string, @Param('userId') userId: string) { return this.teamsService.addMember(id, userId); }

  @Delete(':id/members/:userId')
  @Permissions('organization.manage')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) { return this.teamsService.removeMember(id, userId); }

  @Delete(':id')
  @Permissions('organization.manage')
  remove(@Param('id') id: string) { return this.teamsService.remove(id); }
}
