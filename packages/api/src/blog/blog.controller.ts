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
    Patch,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { CurrentUser, JwtAuthGuard, Permissions, RbacGuard } from '../auth';

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
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('blog.read')
    async getAllPosts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('status') status?: string,
    ) {
        return this.blogService.getAllPosts(page, limit, status);
    }

    @Post('admin/posts')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('blog.write')
    async createPost(@Body() dto: CreatePostDto, @CurrentUser('id') userId: string) {
        return this.blogService.createPost(userId, dto);
    }

    @Patch('admin/posts/:id')
    @Put('admin/posts/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('blog.write')
    async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
        return this.blogService.updatePost(id, dto);
    }

    @Delete('admin/posts/:id')
    @UseGuards(JwtAuthGuard, RbacGuard)
    @Permissions('blog.delete')
    async deletePost(@Param('id') id: string) {
        return this.blogService.deletePost(id);
    }
}
