import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RulesService } from './rules.service';

@Controller('rules')
@UseGuards(AuthGuard('jwt'))
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  findAll(
    @Query('level') level?: string,
    @Query('groupId') groupId?: string,
    @Query('teamId') teamId?: string,
    @Query('module') module?: string,
  ) {
    return this.rulesService.findAll({ level, groupId, teamId, module });
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.rulesService.findOne(id); }

  @Post()
  create(@Body() body: any) { return this.rulesService.create(body); }

  @Post('evaluate')
  evaluate(@Body() body: { userId: string; module: string; accessType: string }) {
    return this.rulesService.evaluateAccess(body.userId, body.module, body.accessType);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.rulesService.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.rulesService.remove(id); }
}
