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
import { JwtAuthGuard } from '../auth';

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
    @UseGuards(JwtAuthGuard)
    getAllTeamMembers() {
        return this.teamService.getAllTeamMembers();
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard)
    createTeamMember(@Body() dto: CreateTeamMemberDto) {
        return this.teamService.createTeamMember(dto);
    }

    @Put('admin/:id')
    @UseGuards(JwtAuthGuard)
    updateTeamMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
        return this.teamService.updateTeamMember(id, dto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard)
    deleteTeamMember(@Param('id') id: string) {
        return this.teamService.deleteTeamMember(id);
    }
}
