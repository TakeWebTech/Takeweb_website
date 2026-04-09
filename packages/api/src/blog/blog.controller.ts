import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Roles, CurrentUser, RolesGuard } from '../auth';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) { }

    // Public endpoints
    @Get('posts')
    async getPublishedPosts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('category') category?: string,
        @Query('tag') tag?: string,
    ) {
        return this.blogService.getPublishedPosts(page, limit, category, tag);
    }

    @Get('posts/:slug')
    async getPostBySlug(@Param('slug') slug: string) {
        return this.blogService.getPostBySlug(slug);
    }

    @Get('categories')
    async getCategories() {
        return this.blogService.getCategories();
    }

    @Get('tags')
    async getTags() {
        return this.blogService.getTags();
    }

    // Admin endpoints
    @Get('admin/posts')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR', 'AUTHOR')
    async getAllPosts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('status') status?: string,
    ) {
        return this.blogService.getAllPosts(page, limit, status);
    }

    @Post('admin/posts')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR', 'AUTHOR')
    async createPost(@Body() dto: CreatePostDto, @CurrentUser('id') userId: string) {
        return this.blogService.createPost(userId, dto);
    }

    @Put('admin/posts/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR', 'AUTHOR')
    async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.blogService.updatePost(id, dto);
    }

    @Delete('admin/posts/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'EDITOR')
    async deletePost(@Param('id') id: string) {
        return this.blogService.deletePost(id);
    }
}
