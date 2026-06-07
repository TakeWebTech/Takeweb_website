import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';

export enum WorkType {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

export enum LifecycleStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  EXITED = 'EXITED',
  BLOCKED = 'BLOCKED',
}

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  isDirector?: boolean;

  @IsOptional()
  portalAccess?: boolean;

  @IsOptional()
  @IsString()
  shiftStart?: string;

  @IsOptional()
  @IsString()
  shiftEnd?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  shiftGraceBeforeMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shiftGraceAfterMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lateGraceMinutes?: number;

  @IsOptional()
  @IsString()
  shiftTimezone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  customRoleId?: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  isDirector?: boolean;

  @IsOptional()
  portalAccess?: boolean;

  @IsOptional()
  @IsString()
  shiftStart?: string;

  @IsOptional()
  @IsString()
  shiftEnd?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  shiftGraceBeforeMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shiftGraceAfterMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lateGraceMinutes?: number;

  @IsOptional()
  @IsString()
  shiftTimezone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  customRoleId?: string;

  @IsOptional()
  @IsEnum(LifecycleStatus)
  lifecycleStatus?: LifecycleStatus;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateLifecycleDto {
  @IsEnum(LifecycleStatus)
  lifecycleStatus: LifecycleStatus;
}
