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
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

@Controller('media')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get()
    @Permissions('media.read')
    getAllMedia(@Query('folder') folder?: string) {
        return this.mediaService.getAllMedia(folder);
    }

    @Get('folders')
    @Permissions('media.read')
    getFolders() {
        return this.mediaService.getFolders();
    }

    @Get(':id')
    @Permissions('media.read')
    getMediaById(@Param('id') id: string) {
        return this.mediaService.getMediaById(id);
    }

    @Post()
    @Permissions('media.write')
    createMedia(@Body() dto: CreateMediaDto) {
        return this.mediaService.createMedia(dto);
    }

    @Post('upload')
    @Permissions('media.write')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: uploadDir,
            filename: (_req: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const safeBase = file.originalname
                    .replace(extname(file.originalname), '')
                    .replace(/[^a-zA-Z0-9-_]/g, '-')
                    .slice(0, 80);
                cb(null, `${safeBase}-${Date.now()}${extname(file.originalname)}`);
            },
        }),
    }))
    uploadMedia(@UploadedFiles() files: any[]) {
        return this.mediaService.createUploadedMedia(files || []);
    }

    @Put(':id')
    @Permissions('media.write')
    updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
        return this.mediaService.updateMedia(id, dto);
    }

    @Delete(':id')
    @Permissions('media.delete')
    deleteMedia(@Param('id') id: string) {
        return this.mediaService.deleteMedia(id);
    }
}
