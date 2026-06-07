import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    // Public routes
    @Get()
    getActiveTeamMembers() {
        return this.teamService.getActiveTeamMembers();
    }

    // Admin routes
    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('team.read')
    getAllTeamMembers() {
        return this.teamService.getAllTeamMembers();
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('team.write')
    createTeamMember(@Body() dto: CreateTeamMemberDto) {
        return this.teamService.createTeamMember(dto);
    }

    @Put('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('team.write')
    updateTeamMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
        return this.teamService.updateTeamMember(id, dto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('team.delete')
    deleteTeamMember(@Param('id') id: string) {
        return this.teamService.deleteTeamMember(id);
    }
}
