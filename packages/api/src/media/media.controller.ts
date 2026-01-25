import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import { JwtAuthGuard } from '../auth';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get()
    getAllMedia(@Query('folder') folder?: string) {
        return this.mediaService.getAllMedia(folder);
    }

    @Get('folders')
    getFolders() {
        return this.mediaService.getFolders();
    }

    @Get(':id')
    getMediaById(@Param('id') id: string) {
        return this.mediaService.getMediaById(id);
    }

    @Post()
    createMedia(@Body() dto: CreateMediaDto) {
        return this.mediaService.createMedia(dto);
    }

    @Put(':id')
    updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
        return this.mediaService.updateMedia(id, dto);
    }

    @Delete(':id')
    deleteMedia(@Param('id') id: string) {
        return this.mediaService.deleteMedia(id);
    }
}
