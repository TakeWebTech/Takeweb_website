import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    // Public methods
    async getActiveProjects() {
        return this.prisma.project.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            include: {
                service: { select: { id: true, title: true, slug: true } },
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
    }

    async getFeaturedProjects() {
        return this.prisma.project.findMany({
            where: { isActive: true, isFeatured: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
            include: {
                service: { select: { id: true, title: true, slug: true } },
            },
        });
    }

    async getProjectBySlug(slug: string) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
            include: {
                service: true,
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });

        if (!project || !project.isActive) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    // Admin methods
    async getAllProjects() {
        return this.prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                service: { select: { id: true, title: true } },
            },
        });
    }

    async createProject(dto: CreateProjectDto) {
        const { images, serviceId, ...data } = dto;
        return this.prisma.project.create({
            data: {
                ...data,
                technologies: dto.technologies ?? [],
                serviceId: serviceId?.trim() ? serviceId : undefined,
                isActive: dto.isActive ?? true,
                isFeatured: dto.isFeatured ?? false,
                images: images?.length
                    ? { create: images.map((url, index) => ({ url, sortOrder: index })) }
                    : undefined,
            },
            include: { images: true, service: { select: { id: true, title: true } } },
        });
    }

    async updateProject(id: string, dto: UpdateProjectDto) {
        const project = await this.prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const { images, serviceId, ...data } = dto;
        return this.prisma.$transaction(async (tx) => {
            if (images) {
                await tx.projectImage.deleteMany({ where: { projectId: id } });
            }

            return tx.project.update({
                where: { id },
                data: {
                    ...data,
                    technologies: dto.technologies ?? undefined,
                    serviceId: serviceId !== undefined ? (serviceId.trim() ? serviceId : null) : undefined,
                    images: images
                        ? { create: images.map((url, index) => ({ url, sortOrder: index })) }
                        : undefined,
                },
                include: { images: true, service: { select: { id: true, title: true } } },
            });
        });
    }

    async deleteProject(id: string) {
        const project = await this.prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return this.prisma.project.delete({ where: { id } });
    }
}
