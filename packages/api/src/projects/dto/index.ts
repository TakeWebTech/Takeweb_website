import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    client?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    challenge?: string;

    @IsOptional()
    @IsString()
    solution?: string;

    @IsOptional()
    @IsString()
    outcome?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    serviceId?: string;

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    client?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    challenge?: string;

    @IsOptional()
    @IsString()
    solution?: string;

    @IsOptional()
    @IsString()
    outcome?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    serviceId?: string;

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;
}
