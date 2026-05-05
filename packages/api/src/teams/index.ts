import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

export { TeamsService } from './teams.service';
