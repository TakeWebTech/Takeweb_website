import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';
import { CreatePageDto, UpdatePageDto } from './dto';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findPublished() {
    return this.pagesService.findPublished();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('page.read')
  findAll() {
    return this.pagesService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('page.read')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('page.write')
  create(@Body() dto: CreatePageDto) {
    return this.pagesService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('page.write')
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('page.delete')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
