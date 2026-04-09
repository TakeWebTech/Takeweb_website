import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateCareerDto, UpdateCareerDto } from './dto';
import { JwtAuthGuard } from '../auth';

@Controller('careers')
export class CareersController {
    constructor(private readonly careersService: CareersService) { }

    // Public routes
    @Get()
    getActiveJobs() {
        return this.careersService.getActiveJobs();
    }

    @Get(':slug')
    getJobBySlug(@Param('slug') slug: string) {
        return this.careersService.getJobBySlug(slug);
    }

    @Post(':id/apply')
    submitApplication(
        @Param('id') id: string,
        @Body() data: {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            resumeUrl?: string;
            coverLetter?: string;
        },
    ) {
        return this.careersService.submitApplication(id, data);
    }

    // Admin routes
    @Get('admin/all')
    @UseGuards(JwtAuthGuard)
    getAllJobs() {
        return this.careersService.getAllJobs();
    }

    @Get('admin/:id/applications')
    @UseGuards(JwtAuthGuard)
    getJobApplications(@Param('id') id: string) {
        return this.careersService.getJobApplications(id);
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard)
    createJob(@Body() dto: CreateCareerDto) {
        return this.careersService.createJob(dto);
    }

    @Put('admin/:id')
    @UseGuards(JwtAuthGuard)
    updateJob(@Param('id') id: string, @Body() dto: UpdateCareerDto) {
        return this.careersService.updateJob(id, dto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard)
    deleteJob(@Param('id') id: string) {
        return this.careersService.deleteJob(id);
    }

    @Patch('admin/applications/:id/status')
    @UseGuards(JwtAuthGuard)
    updateApplicationStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.careersService.updateApplicationStatus(id, status);
    }
}
