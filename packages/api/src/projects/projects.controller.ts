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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { JwtAuthGuard } from '../auth';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    // Public routes
    @Get()
    getActiveProjects() {
        return this.projectsService.getActiveProjects();
    }

    @Get('featured')
    getFeaturedProjects() {
        return this.projectsService.getFeaturedProjects();
    }

    @Get(':slug')
    getProjectBySlug(@Param('slug') slug: string) {
        return this.projectsService.getProjectBySlug(slug);
    }

    // Admin routes
    @Get('admin/all')
    @UseGuards(JwtAuthGuard)
    getAllProjects() {
        return this.projectsService.getAllProjects();
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard)
    createProject(@Body() dto: CreateProjectDto) {
        return this.projectsService.createProject(dto);
    }

    @Put('admin/:id')
    @UseGuards(JwtAuthGuard)
    updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
        return this.projectsService.updateProject(id, dto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard)
    deleteProject(@Param('id') id: string) {
        return this.projectsService.deleteProject(id);
    }
}
