import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('rules')
@UseGuards(JwtAuthGuard, RbacGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  @Permissions('rules.manage')
  findAll(
    @Query('level') level?: string,
    @Query('groupId') groupId?: string,
    @Query('teamId') teamId?: string,
    @Query('module') module?: string,
  ) {
    return this.rulesService.findAll({ level, groupId, teamId, module });
  }

  @Get(':id')
  @Permissions('rules.manage')
  findOne(@Param('id') id: string) { return this.rulesService.findOne(id); }

  @Post()
  @Permissions('rules.manage')
  create(@Body() body: any) { return this.rulesService.create(body); }

  @Post('evaluate')
  @Permissions('rules.manage')
  evaluate(@Body() body: { userId: string; module: string; accessType: string }) {
    return this.rulesService.evaluateAccess(body.userId, body.module, body.accessType);
  }

  @Patch(':id')
  @Permissions('rules.manage')
  update(@Param('id') id: string, @Body() body: any) { return this.rulesService.update(id, body); }

  @Delete(':id')
  @Permissions('rules.manage')
  remove(@Param('id') id: string) { return this.rulesService.remove(id); }
}
