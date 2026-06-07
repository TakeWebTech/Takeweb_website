import { Controller, Get, Post, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard, Permissions, RbacGuard } from '../auth';

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    // ============ Workflow & Targets ============

    @Get('workflow-targets')
    @Permissions('review.read')
    getWorkflowTargets(@Request() req: any) {
        return this.reviewsService.getWorkflowTargets(req.user.id);
    }

    // Legacy method for standard usage
    @Get('targets')
    @Permissions('review.read')
    getTargets(@Request() req: any) {
        return this.reviewsService.getTargets(req.user.id);
    }

    // ============ Reading Reviews ============

    @Get('received')
    @Permissions('review.read')
    getReceivedReviews(@Request() req: any) {
        return this.reviewsService.getReceivedReviews(req.user.id);
    }

    @Get('stats')
    @Permissions('review.read')
    getStats(@Request() req: any) {
        return this.reviewsService.getStats(req.user.id);
    }

    // ============ Submitting Reviews ============

    @Post()
    @Permissions('review.write')
    createReview(@Request() req: any, @Body() body: { targetUserId: string, rating?: number, comment?: string, status: string, categoryId: string }) {
        return this.reviewsService.createReview(req.user.id, body);
    }

    // ============ Company Feedback ============

    @Post('feedback')
    @Permissions('review.write')
    submitCompanyFeedback(@Request() req: any, @Body() body: { category: string, priority: string, content: string, isAnonymous: boolean }) {
        return this.reviewsService.submitCompanyFeedback(req.user.id, body);
    }

    // ============ Admin Endpoints ============

    @Get('admin/received')
    @Permissions('review.admin.read')
    getReceivedReviewsAdmin(@Query('targetUserId') targetUserId?: string) {
        return this.reviewsService.getReceivedReviewsAdmin(targetUserId);
    }

    @Get('admin/settings')
    @Permissions('review.admin.read')
    getSettings() {
        return this.reviewsService.getSettings();
    }

    @Put('admin/settings')
    @Permissions('review.admin.write')
    updateSettings(@Body() body: any) {
        return this.reviewsService.updateSettings(body);
    }
}
