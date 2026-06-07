import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  findPublished() {
    return this.testimonialsService.findPublished();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('testimonial.read')
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('testimonial.read')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('testimonial.write')
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('testimonial.write')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('testimonial.delete')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
