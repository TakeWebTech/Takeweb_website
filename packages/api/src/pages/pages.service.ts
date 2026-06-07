import { Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto } from './dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.page.findMany({
      where: { status: PostStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  findAll() {
    return this.prisma.page.findMany({
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    if (!page || page.status !== PostStatus.PUBLISHED) throw new NotFoundException('Page not found');
    return page;
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  create(dto: CreatePageDto) {
    return this.prisma.page.create({
      data: {
        ...dto,
        status: dto.status ?? PostStatus.DRAFT,
        sortOrder: dto.sortOrder ?? 0,
        isSystem: dto.isSystem ?? false,
      },
    });
  }

  async update(id: string, dto: UpdatePageDto) {
    await this.findOne(id);
    return this.prisma.page.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.page.delete({ where: { id } });
  }
}
