import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto, UpdateLifecycleDto } from './dto';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('employees')
@UseGuards(JwtAuthGuard, RbacGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Permissions('employee.read')
  findAll(
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('workType') workType?: string,
    @Query('status') status?: string,
    @Query('groupId') groupId?: string,
    @Query('teamId') teamId?: string,
  ) {
    return this.employeesService.findAll({ search, department, workType, status, groupId, teamId });
  }

  @Get('stats')
  @Permissions('employee.read')
  getStats() {
    return this.employeesService.getStats();
  }

  @Get(':id')
  @Permissions('employee.read')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @Permissions('employee.write')
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Patch(':id')
  @Permissions('employee.write')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  @Patch(':id/lifecycle')
  @Permissions('employee.write')
  updateLifecycle(@Param('id') id: string, @Body() dto: UpdateLifecycleDto) {
    return this.employeesService.updateLifecycle(id, dto);
  }

  @Delete(':id')
  @Permissions('employee.delete')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
