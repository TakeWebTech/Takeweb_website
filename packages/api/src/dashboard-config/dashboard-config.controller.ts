import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardConfigService } from './dashboard-config.service';
import { CurrentUser } from '../auth/decorators';

@Controller('dashboard-config')
@UseGuards(AuthGuard('jwt'))
export class DashboardConfigController {
  constructor(private readonly dashboardConfigService: DashboardConfigService) {}

  @Get('widgets')
  getAvailableWidgets() { return this.dashboardConfigService.getAvailableWidgets(); }

  @Get('defaults/:role')
  getDefaults(@Param('role') role: string) { return this.dashboardConfigService.getDefaultWidgets(role); }

  @Get('layout')
  getLayout(@CurrentUser() user: any) { return this.dashboardConfigService.getLayout(user.id); }

  @Get('layouts')
  getAllLayouts(@CurrentUser() user: any) { return this.dashboardConfigService.getAllLayouts(user.id); }

  @Post('layout')
  saveLayout(@CurrentUser() user: any, @Body() body: { name?: string; widgets: any[]; isDefault?: boolean }) {
    return this.dashboardConfigService.saveLayout(user.id, body);
  }

  @Delete('layout/:name')
  deleteLayout(@CurrentUser() user: any, @Param('name') name: string) {
    return this.dashboardConfigService.deleteLayout(user.id, name);
  }
}
