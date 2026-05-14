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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto';
import { Roles, RolesGuard } from '../auth';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    @Post()
    async submitContact(@Body() dto: CreateContactDto) {
        return this.contactService.createSubmission(dto);
    }

    // Admin endpoints
    @Get('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    async getAllSubmissions(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('status') status?: string,
    ) {
        return this.contactService.getSubmissions(page, limit, status);
    }

    @Get('admin/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    async getSubmission(@Param('id') id: string) {
        return this.contactService.getSubmissionById(id);
    }
}
