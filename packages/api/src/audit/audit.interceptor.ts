import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditMutationInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;

    if (!user?.id || !MUTATION_METHODS.has(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((response: any) => {
        const moduleName = this.getModuleName(request.path || request.url || '');
        if (moduleName === 'audit') return;

        void this.auditService.log({
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: method,
          module: moduleName,
          entityType: this.getEntityType(moduleName),
          entityId: request.params?.id || response?.id || response?.data?.id,
          description: `${method} ${request.path || request.url}`,
          metadata: {
            ip: request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown',
            userAgent: request.headers['user-agent'] || 'unknown',
          },
        }).catch(() => undefined);
      }),
    );
  }

  private getModuleName(path: string) {
    return path
      .replace(/^\/api\/v\d+\//, '')
      .replace(/^\//, '')
      .split('/')[0] || 'system';
  }

  private getEntityType(moduleName: string) {
    return moduleName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}
