import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status-dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUserRole(userId: string, role: UserRole) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  user.role = role;
  const updatedUser = await this.userRepository.save(user);

  return {
    userId: updatedUser.id,
    role: updatedUser.role,
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