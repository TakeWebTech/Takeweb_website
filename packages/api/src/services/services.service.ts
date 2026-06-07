import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    // Public methods
    async getActiveServices() {
        return this.prisma.service.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getServiceBySlug(slug: string) {
        const service = await this.prisma.service.findUnique({
            where: { slug },
            include: { projects: true },
        });

        if (!service || !service.isActive) {
            throw new NotFoundException('Service not found');
        }

        return service;
    }

    // Admin methods
    async getAllServices() {
        return this.prisma.service.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }

    async createService(dto: CreateServiceDto) {
        return this.prisma.service.create({
            data: {
                ...dto,
                benefits: dto.benefits ?? [],
                technologies: dto.technologies ?? [],
                useCases: dto.useCases ?? [],
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }

    async updateService(id: string, dto: UpdateServiceDto) {
        const service = await this.prisma.service.findUnique({ where: { id } });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        return this.prisma.service.update({
            where: { id },
            data: {
                ...dto,
                benefits: dto.benefits ?? undefined,
                technologies: dto.technologies ?? undefined,
                useCases: dto.useCases ?? undefined,
            },
        });
    }

    async deleteService(id: string) {
        const service = await this.prisma.service.findUnique({ where: { id } });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        return this.prisma.service.delete({ where: { id } });
    }
}
