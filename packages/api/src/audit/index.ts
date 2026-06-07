import { Module, Global } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditMutationInterceptor } from './audit.interceptor';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuditController],
  providers: [AuditService, AuditMutationInterceptor],
  exports: [AuditService, AuditMutationInterceptor],
})
export class AuditModule {}

export { AuditService } from './audit.service';
export { AuditMutationInterceptor } from './audit.interceptor';
