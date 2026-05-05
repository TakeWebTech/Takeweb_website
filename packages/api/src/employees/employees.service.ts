import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto, UpdateLifecycleDto } from './dto';

const EMPLOYEE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  avatar: true,
  bio: true,
  isActive: true,
  employeeId: true,
  dateOfBirth: true,
  joiningDate: true,
  workType: true,
  department: true,
  location: true,
  phone: true,
  lifecycleStatus: true,
  groupId: true,
  teamId: true,
  customRoleId: true,
  createdAt: true,
  updatedAt: true,
  group: { select: { id: true, name: true } },
  team: { select: { id: true, name: true } },
  customRole: { select: { id: true, name: true } },
};

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { search?: string; department?: string; workType?: string; status?: string; groupId?: string; teamId?: string }) {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { employeeId: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query?.department) where.department = query.department;
    if (query?.workType) where.workType = query.workType;
    if (query?.status) where.lifecycleStatus = query.status;
    if (query?.groupId) where.groupId = query.groupId;
    if (query?.teamId) where.teamId = query.teamId;

    return this.prisma.user.findMany({
      where,
      select: EMPLOYEE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...EMPLOYEE_SELECT,
        sessions: { select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    if (dto.employeeId) {
      const existingEmpId = await this.prisma.user.findUnique({ where: { employeeId: dto.employeeId } });
      if (existingEmpId) throw new ConflictException('Employee ID already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const { password, ...data } = dto;

    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash,
        role: (dto.role as any) || 'AUTHOR',
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : undefined,
        employeeId: dto.employeeId || `EMP-${Date.now().toString(36).toUpperCase()}`,
      },
      select: EMPLOYEE_SELECT,
    });
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.joiningDate) data.joiningDate = new Date(dto.joiningDate);

    return this.prisma.user.update({
      where: { id },
      data,
      select: EMPLOYEE_SELECT,
    });
  }

  async updateLifecycle(id: string, dto: UpdateLifecycleDto) {
    await this.findOne(id);

    const isActive = dto.lifecycleStatus === 'ACTIVE';

    return this.prisma.user.update({
      where: { id },
      data: {
        lifecycleStatus: dto.lifecycleStatus as any,
        isActive,
      },
      select: EMPLOYEE_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async getStats() {
    const [total, active, onLeave, exited, blocked] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { lifecycleStatus: 'ACTIVE' } }),
      this.prisma.user.count({ where: { lifecycleStatus: 'ON_LEAVE' } }),
      this.prisma.user.count({ where: { lifecycleStatus: 'EXITED' } }),
      this.prisma.user.count({ where: { lifecycleStatus: 'BLOCKED' } }),
    ]);

    const byDepartment = await this.prisma.user.groupBy({
      by: ['department'],
      _count: true,
      where: { department: { not: null } },
    });

    const byWorkType = await this.prisma.user.groupBy({
      by: ['workType'],
      _count: true,
    });

    return { total, active, onLeave, exited, blocked, byDepartment, byWorkType };
  }
}
