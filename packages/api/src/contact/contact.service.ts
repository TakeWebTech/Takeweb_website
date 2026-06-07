import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto';

// Contact status enum (matching Prisma schema)
export enum ContactStatus {
    NEW = 'NEW',
    READ = 'READ',
    REPLIED = 'REPLIED',
    ARCHIVED = 'ARCHIVED',
}

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) { }

    async createSubmission(dto: CreateContactDto) {
        return this.prisma.contactSubmission.create({
            data: {
                ...dto,
                status: ContactStatus.NEW,
            },
        });
    }

    async getSubmissions(page = 1, limit = 20, status?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (status) {
            where.status = status;
        }

        const [submissions, total] = await Promise.all([
            this.prisma.contactSubmission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contactSubmission.count({ where }),
        ]);

        return {
            submissions,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    async getSubmissionById(id: string) {
        const submission = await this.prisma.contactSubmission.findUnique({
            where: { id },
        });

        if (!submission) {
            throw new NotFoundException('Submission not found');
        }

        // Mark as read if new
        if (submission.status === ContactStatus.NEW) {
            await this.prisma.contactSubmission.update({
                where: { id },
                data: { status: ContactStatus.READ },
            });
        }

        return submission;
    }

    async updateSubmission(id: string, data: { status?: ContactStatus; notes?: string }) {
        await this.getSubmissionById(id);
        return this.prisma.contactSubmission.update({
            where: { id },
            data,
        });
    }

    async deleteSubmission(id: string) {
        await this.getSubmissionById(id);
        return this.prisma.contactSubmission.delete({ where: { id } });
    }
}
