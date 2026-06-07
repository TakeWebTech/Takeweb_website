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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    // Public routes
    @Get()
    getActiveServices() {
        return this.servicesService.getActiveServices();
    }

    @Get(':slug')
    getServiceBySlug(@Param('slug') slug: string) {
        return this.servicesService.getServiceBySlug(slug);
    }

    // Admin routes
    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('service.read')
    getAllServices() {
        return this.servicesService.getAllServices();
    }

    @Post('admin')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('service.write')
    createService(@Body() dto: CreateServiceDto) {
        return this.servicesService.createService(dto);
    }

    @Put('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('service.write')
    updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
        return this.servicesService.updateService(id, dto);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('service.delete')
    deleteService(@Param('id') id: string) {
        return this.servicesService.deleteService(id);
    }
}
