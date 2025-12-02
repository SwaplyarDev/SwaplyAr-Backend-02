import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Obtener roles del usuario
    let userRoleCodes: string[] = [];
    if (user.roles && Array.isArray(user.roles)) {
      userRoleCodes = user.roles.map(role => role.code || role);
    } else {
      const userRole = user.role_code || user.role;
      if (userRole) userRoleCodes = [userRole];
    }
    
    // Verificar roles específicos
    return requiredRoles.some(role => userRoleCodes.includes(role));
  }
}
