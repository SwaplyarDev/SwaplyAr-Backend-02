import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles?.some(role => ['admin', 'super_admin'].includes(role.code))) {
      throw new ForbiddenException('Acceso solo para administradores');
    }
    return true;
  }
}
