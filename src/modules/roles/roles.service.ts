import { Injectable, NotFoundException, OnModuleInit, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-roles.dto';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.createDefaultAdmin();
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
    const exists = await this.roleRepository.findOne({ where: { code: createRoleDto.code } });
    if (exists) {
      throw new ConflictException(`El rol con código '${createRoleDto.code}' ya existe`);
    }
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async seedRoles(): Promise<Roles[]> {
    const defaultRoles = [
      { code: 'user', name: 'Usuario', description: 'Usuario estándar' },
      { code: 'admin', name: 'Administrador', description: 'Admin del sistema' },
      {
        code: 'super_admin',
        name: 'Administrador Superior',
        description: 'Administrador de contenido y usuarios',
      },
    ];

    const roles: Roles[] = [];
    for (const roleData of defaultRoles) {
      const exists = await this.roleRepository.findOne({ where: { code: roleData.code } });
      if (!exists) {
        const role = await this.createRole(roleData);
        roles.push(role);
      }
    }
    return roles;
  }

  async createDefaultAdmin(): Promise<void> {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@swaplyar.com';
    const firstName = process.env.DEFAULT_ADMIN_FIRST_NAME || 'Admin';
    const lastName = process.env.DEFAULT_ADMIN_LAST_NAME || 'System';
    const memberCode = process.env.DEFAULT_ADMIN_MEMBER_CODE || 'ADMIN001';

    const existingProfile = await this.userProfileRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingProfile) return;

    const adminRole = await this.findByCode('admin');

    const adminUser = this.userRepository.create({
      termsAccepted: true,
      memberCode,
      isActive: true,
      roles: [adminRole],
    });

    const savedUser = await this.userRepository.save(adminUser);

    const adminProfile = this.userProfileRepository.create({
      firstName,
      lastName,
      email: adminEmail,
      user: savedUser,
    });

    await this.userProfileRepository.save(adminProfile);
    
    // Sincronizar columnas de roles después de crear el perfil
    await this.syncUserRoleColumns(savedUser.id);
  }

  async findByCode(code: string): Promise<Roles> {
    const role = await this.roleRepository.findOne({ where: { code } });
    if (!role) {
      throw new NotFoundException(`Rol con código '${code}' no encontrado`);
    }
    return role;
  }

  // Nuevo método para actualizar rol de usuario usando tabla de roles
  async updateUserRole(userId: string, roleCode: string) {
    // 1. Verificar que el rol existe en la tabla
    const role = await this.findByCode(roleCode);

    // 2. Buscar el usuario y actualizar sus roles
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 3. Actualizar la relación usuario-roles
    user.roles = [role];
    const updatedUser = await this.userRepository.save(user);

    // 4. Sincronizar columnas desnormalizadas
    await this.syncUserRoleColumns(userId);

    return {
      userId: updatedUser.id,
      roles: updatedUser.roles.map((r) => ({
        role_id: r.role_id,
        code: r.code,
        name: r.name,
        description: r.description,
      })),
    };
  }

  // Método para agregar rol adicional a usuario
  async addUserRole(userId: string, roleCode: string) {
    const role = await this.findByCode(roleCode);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya tiene el rol
    const hasRole = user.roles.some((r) => r.code === roleCode);
    if (hasRole) {
      throw new ConflictException(`El usuario ya tiene el rol '${roleCode}'`);
    }

    user.roles.push(role);
    const updatedUser = await this.userRepository.save(user);

    // Sincronizar columnas desnormalizadas
    await this.syncUserRoleColumns(userId);

    return {
      userId: updatedUser.id,
      roles: updatedUser.roles.map((r) => ({
        role_id: r.role_id,
        code: r.code,
        name: r.name,
        description: r.description,
      })),
    };
  }

  // Método para sincronizar columnas desnormalizadas
  async syncUserRoleColumns(userId: string) {
    await this.userRepository.query(
      `
            UPDATE users 
            SET 
                role_code = COALESCE((SELECT string_agg(r.code, ', ' ORDER BY r.code) FROM user_roles ur JOIN roles r ON ur.role_id = r.role_id WHERE ur.user_id = $1), ''),
                role_name = COALESCE((SELECT string_agg(r.name, ', ' ORDER BY r.code) FROM user_roles ur JOIN roles r ON ur.role_id = r.role_id WHERE ur.user_id = $1), ''),
                role_description = COALESCE((SELECT string_agg(r.description, ', ' ORDER BY r.code) FROM user_roles ur JOIN roles r ON ur.role_id = r.role_id WHERE ur.user_id = $1), '')
            WHERE user_id = $1
        `,
      [userId],
    );
  }

  // Método para obtener todos los roles disponibles
  async getAllRoles(): Promise<Roles[]> {
    return await this.roleRepository.find({
      order: { code: 'ASC' },
    });
  }
}
