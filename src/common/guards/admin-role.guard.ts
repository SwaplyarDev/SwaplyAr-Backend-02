import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !['admin', 'super_admin'].includes(user.role?.code)) {
      throw new ForbiddenException('Acceso solo para administradores');
    }
    return true;
  }
}
