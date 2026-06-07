import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [PrismaModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}

export { PagesService } from './pages.service';
