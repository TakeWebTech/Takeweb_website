import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

// Post status enum (matching Prisma schema)
export enum PostStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

@Injectable()
export class BlogService {
    constructor(private prisma: PrismaService) { }

    // Public methods
    async getPublishedPosts(page = 1, limit = 10, categorySlug?: string, tagSlug?: string) {
        const skip = (page - 1) * limit;
        const where: any = {
            status: PostStatus.PUBLISHED,
            publishedAt: { lte: new Date() },
        };

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (tagSlug) {
            where.tags = { some: { tag: { slug: tagSlug } } };
        }

        const [posts, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                    category: { select: { id: true, name: true, slug: true } },
                    tags: { include: { tag: true } },
                },
            }),
            this.prisma.blogPost.count({ where }),
        ]);

        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getPostBySlug(slug: string) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } },
                category: true,
                tags: { include: { tag: true } },
            },
        });

        if (!post || post.status !== PostStatus.PUBLISHED) {
            throw new NotFoundException('Post not found');
        }

        // Increment view count
        await this.prisma.blogPost.update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } },
        });

        return post;
    }

    // Admin methods
    async getAllPosts(page = 1, limit = 10, status?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (status) {
            where.status = status;
        }

        const [posts, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: { select: { id: true, firstName: true, lastName: true } },
                    category: { select: { id: true, name: true, slug: true } },
                },
            }),
            this.prisma.blogPost.count({ where }),
        ]);

        return {
            posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }

    async createPost(authorId: string, dto: CreatePostDto) {
        return this.prisma.blogPost.create({
            data: {
                ...dto,
                authorId,
                status: dto.status || PostStatus.DRAFT,
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
                category: true,
            },
        });
    }

    async updatePost(id: string, dto: UpdatePostDto) {
        const post = await this.prisma.blogPost.findUnique({ where: { id } });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Auto-set publishedAt when publishing
        const data: any = { ...dto };
        if (dto.status === PostStatus.PUBLISHED && !post.publishedAt) {
            data.publishedAt = new Date();
        }

        return this.prisma.blogPost.update({
            where: { id },
            data,
            include: { author: { select: { id: true, firstName: true, lastName: true } }, category: true },
        });
    }

    async deletePost(id: string) {
        return this.prisma.blogPost.delete({ where: { id } });
    }

    async getCategories() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async getTags() {
        return this.prisma.tag.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
