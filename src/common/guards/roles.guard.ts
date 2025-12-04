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
    if (!user) {
      return false;
    }

    // Obtener roles del usuario desde múltiples fuentes
    let userRoleCodes: string[] = [];
    
    // 1. Desde la relación roles (tabla de roles)
    if (user.roles && Array.isArray(user.roles)) {
      userRoleCodes = user.roles.map((role) => {
        // Si es un objeto con code, usar code; si es string, usar directamente
        return typeof role === 'object' ? role.code : role;
      }).filter(Boolean);
    }
    
    // 2. Fallback: desde campos desnormalizados
    if (userRoleCodes.length === 0) {
      const roleCode = user.role_code || user.roleCode;
      if (roleCode) {
        // Puede ser una cadena separada por comas
        userRoleCodes = roleCode.split(',').map((r: string) => r.trim()).filter(Boolean);
      }
    }
    
    // 3. Fallback final: rol legacy
    if (userRoleCodes.length === 0 && user.role) {
      userRoleCodes = [user.role];
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some((requiredRole) => 
      userRoleCodes.includes(requiredRole)
    );
  }
}
