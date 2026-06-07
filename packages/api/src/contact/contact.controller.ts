import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    Patch,
    Delete,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto';
import { ContactStatus } from './contact.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    @Post()
    async submitContact(@Body() dto: CreateContactDto) {
        return this.contactService.createSubmission(dto);
    }

    // Admin endpoints
    @Get('admin')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('contact.read')
    async getAllSubmissions(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('status') status?: string,
    ) {
        return this.contactService.getSubmissions(page, limit, status);
    }

    @Get('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('contact.read')
    async getSubmission(@Param('id') id: string) {
        return this.contactService.getSubmissionById(id);
    }

    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('contact.write')
    async updateSubmission(
        @Param('id') id: string,
        @Body() body: { status?: ContactStatus; notes?: string },
    ) {
        return this.contactService.updateSubmission(id, body);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('contact.delete')
    async deleteSubmission(@Param('id') id: string) {
        return this.contactService.deleteSubmission(id);
    }
}
