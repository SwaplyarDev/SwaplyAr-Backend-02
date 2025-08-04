import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';

import { UserSocials } from './entities/user-socials.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(UserSocials)
    private socialsRepository: Repository<UserSocials>,
  ) {}

  async register(userDto: RegisterUserDto): Promise<User> {
    const user = new User();
    const userProfile = new UserProfile();

    userProfile.firstName = userDto.firstName || 'Nombre';
    userProfile.lastName = userDto.lastName || 'Apellido';
    userProfile.email = userDto.email || 'sin.email@dominio.com';

    user.profile = userProfile;
    user.termsAccepted = userDto.termsAccepted ?? false;
    user.role = userDto.role || 'user';

    user.rewardsLedger = new UserRewardsLedger();

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { profile: { email } },
      relations: { profile: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { profile: true, rewardsLedger: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUserRole(
    userId: string,
    role: 'user' | 'admin' | 'super_admin',
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.role = role;
    return this.userRepository.save(user);
  }
}
