import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) { }

    // Public methods
    async getActiveTeamMembers() {
        return this.prisma.teamMember.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    // Admin methods
    async getAllTeamMembers() {
        return this.prisma.teamMember.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }

    async createTeamMember(dto: CreateTeamMemberDto) {
        return this.prisma.teamMember.create({
            data: {
                ...dto,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }

    async updateTeamMember(id: string, dto: UpdateTeamMemberDto) {
        const member = await this.prisma.teamMember.findUnique({ where: { id } });

        if (!member) {
            throw new NotFoundException('Team member not found');
        }

        return this.prisma.teamMember.update({
            where: { id },
            data: dto,
        });
    }

    async deleteTeamMember(id: string) {
        const member = await this.prisma.teamMember.findUnique({ where: { id } });

        if (!member) {
            throw new NotFoundException('Team member not found');
        }

        return this.prisma.teamMember.delete({ where: { id } });
    }
}
