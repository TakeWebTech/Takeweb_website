import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerDto, UpdateCareerDto } from './dto';

@Injectable()
export class CareersService {
    constructor(private prisma: PrismaService) { }

    // Public methods
    async getActiveJobs() {
        return this.prisma.career.findMany({
            where: {
                isActive: true,
                OR: [
                    { deadline: null },
                    { deadline: { gte: new Date() } },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getJobBySlug(slug: string) {
        const job = await this.prisma.career.findUnique({
            where: { slug },
            include: {
                applications: {
                    select: { id: true },
                },
            },
        });

        if (!job || !job.isActive) {
            throw new NotFoundException('Job not found');
        }

        return {
            ...job,
            applicationCount: job.applications.length,
            applications: undefined,
        };
    }

    // Admin methods
    async getAllJobs() {
        return this.prisma.career.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });
    }

    async getJobApplications(jobId: string) {
        return this.prisma.jobApplication.findMany({
            where: { careerId: jobId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createJob(dto: CreateCareerDto) {
        return this.prisma.career.create({
            data: {
                ...dto,
                benefits: dto.benefits ?? [],
                isActive: dto.isActive ?? true,
                deadline: dto.deadline ? new Date(dto.deadline) : null,
            },
        });
    }

    async updateJob(id: string, dto: UpdateCareerDto) {
        const job = await this.prisma.career.findUnique({ where: { id } });

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return this.prisma.career.update({
            where: { id },
            data: {
                ...dto,
                benefits: dto.benefits ?? undefined,
                deadline: dto.deadline ? new Date(dto.deadline) : undefined,
            },
        });
    }

    async deleteJob(id: string) {
        const job = await this.prisma.career.findUnique({ where: { id } });

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return this.prisma.career.delete({ where: { id } });
    }

    // Job application methods
    async submitApplication(jobId: string, data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        resumeUrl?: string;
        coverLetter?: string;
    }) {
        const job = await this.prisma.career.findUnique({ where: { id: jobId } });

        if (!job || !job.isActive) {
            throw new NotFoundException('Job not found or not accepting applications');
        }

        return this.prisma.jobApplication.create({
            data: {
                ...data,
                careerId: jobId,
            },
        });
    }

    async updateApplicationStatus(id: string, status: string) {
        return this.prisma.jobApplication.update({
            where: { id },
            data: { status },
        });
    }
}
