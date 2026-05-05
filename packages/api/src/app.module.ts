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
import { SeoModule } from './seo';
// Enterprise HR & RBAC modules
import { EmployeesModule } from './employees';
import { GroupsModule } from './groups';
import { TeamsModule } from './teams';
import { RolesModule } from './roles';
import { RulesModule } from './rules';
import { AuditModule } from './audit';
import { DashboardConfigModule } from './dashboard-config';

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
    SeoModule,
    // Enterprise HR & RBAC
    EmployeesModule,
    GroupsModule,
    TeamsModule,
    RolesModule,
    RulesModule,
    AuditModule,
    DashboardConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
