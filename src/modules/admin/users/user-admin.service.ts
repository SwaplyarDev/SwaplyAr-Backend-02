import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status-dto';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async updateUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roleEntity = await this.rolesService.findByCode(role);
    user.roles = [roleEntity];
    const updatedUser = await this.userRepository.save(user);

    return {
      userId: updatedUser.id,
      roles: updatedUser.roles,
    };
  }

  async updateUserStatus(userId: string, updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.isActive = updateUserStatusDto.isActive;
    const updatedUser = await this.userRepository.save(user);

    return {
      userId: updatedUser.id,
      isActive: updatedUser.isActive,
    };
  }
}
