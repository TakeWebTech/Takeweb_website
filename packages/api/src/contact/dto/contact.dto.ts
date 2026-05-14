import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsString()
    @IsOptional()
    service?: string;

    @IsString()
    message: string;
}
