import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, IsArray, IsDateString } from 'class-validator';

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
}

export class CreateCareerDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    department: string;

    @IsString()
    location: string;

    @IsOptional()
    @IsEnum(JobType)
    type?: JobType;

    @IsOptional()
    @IsBoolean()
    isRemote?: boolean;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    requirements?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsInt()
    minSalary?: number;

    @IsOptional()
    @IsInt()
    maxSalary?: number;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCareerDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(JobType)
    type?: JobType;

    @IsOptional()
    @IsBoolean()
    isRemote?: boolean;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    requirements?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsInt()
    minSalary?: number;

    @IsOptional()
    @IsInt()
    maxSalary?: number;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
