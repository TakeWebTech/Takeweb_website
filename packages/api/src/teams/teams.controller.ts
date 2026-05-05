import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@Query('groupId') groupId?: string) { return this.teamsService.findAll(groupId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.teamsService.findOne(id); }

  @Post()
  create(@Body() body: { name: string; groupId: string; description?: string; managerId?: string; leadId?: string }) {
    return this.teamsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.teamsService.update(id, body); }

  @Post(':id/members/:userId')
  addMember(@Param('id') id: string, @Param('userId') userId: string) { return this.teamsService.addMember(id, userId); }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) { return this.teamsService.removeMember(id, userId); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.teamsService.remove(id); }
}
