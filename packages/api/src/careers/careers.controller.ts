import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CareersService } from './careers.service';
import { ApplyForJobDto } from './dto';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  getJobs() {
    return this.careersService.getJobs();
  }

  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.careersService.getJob(id);
  }

  @Post(':id/apply')
  apply(@Param('id') id: string, @Body() application: ApplyForJobDto) {
    return this.careersService.apply(id, application);
  }
}
