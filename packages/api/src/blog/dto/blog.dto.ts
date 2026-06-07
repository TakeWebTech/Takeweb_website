import {
    IsString,
    IsOptional,
    IsEnum,
    IsArray,
} from 'class-validator';

// Post status enum (matching Prisma schema)
export enum PostStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsEnum(PostStatus)
    @IsOptional()
    status?: PostStatus;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsString()
    @IsOptional()
    metaTitle?: string;

    @IsString()
    @IsOptional()
    metaDescription?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tagIds?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsEnum(PostStatus)
    @IsOptional()
    status?: PostStatus;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsString()
    @IsOptional()
    metaTitle?: string;

    @IsString()
    @IsOptional()
    metaDescription?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tagIds?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}
