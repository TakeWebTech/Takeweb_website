import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';

@Module({
  imports: [PrismaModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}

export { TestimonialsService } from './testimonials.service';
