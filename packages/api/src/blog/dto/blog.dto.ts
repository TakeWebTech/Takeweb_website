import {
    IsString,
    IsOptional,
    IsEnum,
    IsArray,
    IsUUID,
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

    @IsUUID()
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
    @IsOptional()
    tagIds?: string[];
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

    @IsUUID()
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
}
