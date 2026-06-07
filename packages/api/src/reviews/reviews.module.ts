import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ModerationService } from './moderation.service';

@Module({
    imports: [PrismaModule],
    controllers: [ReviewsController],
    providers: [ReviewsService, ModerationService],
    exports: [ReviewsService, ModerationService],
})
export class ReviewsModule {}
