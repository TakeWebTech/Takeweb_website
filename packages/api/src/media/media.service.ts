import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';

@Injectable()
export class MediaService {
    constructor(private prisma: PrismaService) { }

    async getAllMedia(folder?: string) {
        const where = folder ? { folder } : {};
        return this.prisma.media.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMediaById(id: string) {
        const media = await this.prisma.media.findUnique({ where: { id } });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        return media;
    }

    async createMedia(dto: CreateMediaDto) {
        return this.prisma.media.create({
            data: dto,
        });
    }

    async createUploadedMedia(files: any[]) {
        return Promise.all(
            files.map((file) =>
                this.prisma.media.create({
                    data: {
                        filename: file.filename,
                        originalName: file.originalname,
                        url: `/uploads/${file.filename}`,
                        mimeType: file.mimetype,
                        fileSize: file.size,
                    },
                }),
            ),
        );
    }

    async updateMedia(id: string, dto: UpdateMediaDto) {
        const media = await this.prisma.media.findUnique({ where: { id } });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        return this.prisma.media.update({
            where: { id },
            data: dto,
        });
    }

    async deleteMedia(id: string) {
        const media = await this.prisma.media.findUnique({ where: { id } });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        // TODO: Delete file from storage (local or cloudinary)

        return this.prisma.media.delete({ where: { id } });
    }

    async getFolders() {
        const result = await this.prisma.media.findMany({
            select: { folder: true },
            distinct: ['folder'],
            where: { folder: { not: null } },
        });

        return result.map((r) => r.folder).filter(Boolean);
    }
}
