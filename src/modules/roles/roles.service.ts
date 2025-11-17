import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-roles.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesService implements OnModuleInit {
    constructor(
        @InjectRepository(Roles)
        private roleRepository: Repository<Roles>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async onModuleInit() {
        await this.seedRoles();
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
        const role = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(role);
    }

    async seedRoles(): Promise<Roles[]> {
        const defaultRoles = [
            { code: 'user', name: 'Usuario', description: 'Usuario estándar' },
            { code: 'admin', name: 'Administrador', description: 'Admin del sistema' },
            { code: 'super_admin', name: 'Administrador Superior', description: 'Administrador de contenido y usuarios' }
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
        
        // 2. Buscar el usuario y actualizar su rol
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            relations: ['role']
        });
        
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        
        // 3. Actualizar la relación usuario-rol
        user.role = role;
        const updatedUser = await this.userRepository.save(user);
        
        return {
            userId: updatedUser.id,
            role: {
                role_id: role.role_id,
                code: role.code,
                name: role.name,
                description: role.description
            }
        };
    }
    
    // Método para obtener todos los roles disponibles
    async getAllRoles(): Promise<Roles[]> {
        return await this.roleRepository.find({
            order: { code: 'ASC' }
        });
    }
}