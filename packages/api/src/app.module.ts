import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { BlogModule } from './blog';
import { ContactModule } from './contact';
import { ServicesModule } from './services';
import { ProjectsModule } from './projects';
import { TeamModule } from './team';
import { CareersModule } from './careers';
import { MediaModule } from './media';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    BlogModule,
    ContactModule,
    ServicesModule,
    ProjectsModule,
    TeamModule,
    CareersModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
