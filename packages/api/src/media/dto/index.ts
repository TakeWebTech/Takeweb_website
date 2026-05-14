import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMediaDto {
    @IsString()
    filename: string;

    @IsString()
    originalName: string;

    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    cloudinaryId?: string;

    @IsString()
    mimeType: string;

    @IsInt()
    fileSize: number;

    @IsOptional()
    @IsInt()
    width?: number;

    @IsOptional()
    @IsInt()
    height?: number;

    @IsOptional()
    @IsString()
    alt?: string;

    @IsOptional()
    @IsString()
    folder?: string;
}

export class UpdateMediaDto {
    @IsOptional()
    @IsString()
    alt?: string;

    @IsOptional()
    @IsString()
    folder?: string;
}
