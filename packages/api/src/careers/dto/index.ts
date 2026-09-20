import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyForJobDto {
  @IsString()
  @IsNotEmpty()
  applicant_name: string;

  @IsEmail()
  email_id: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsString()
  cover_letter?: string;
}

export interface ErpJobDto {
  id: string;
  title: string;
  designation: string | null;
  company: string | null;
  department: string | null;
  employment_type: string | null;
  location: string | null;
  posted_on: string | null;
  closes_on: string | null;
  description: string | null;
  salary: string | number | null;
}

export interface JobApplicationResultDto {
  success: true;
  applicant: string;
  job: string;
}
