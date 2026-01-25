import { IsString, IsOptional, IsBoolean, IsInt, IsArray } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    shortDescription: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    gradient?: string;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    useCases?: string[];
}

export class UpdateServiceDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    shortDescription?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    gradient?: string;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    useCases?: string[];
}
