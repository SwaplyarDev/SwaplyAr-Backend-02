import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';
import { EditUserDto } from './dto/edit-user.dto';
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
  // EDITAR INFORMACION DEL USUARIO
  async editUser(userId: string, dto: EditUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const profile = user.profile;

    // Actualizar campos del perfil
    if (dto.firstName !== undefined) profile.firstName = dto.firstName;
    if (dto.lastName !== undefined) profile.lastName = dto.lastName;
    if (dto.identification !== undefined)
      profile.identification = dto.identification;
    if (dto.phone !== undefined) profile.phone = dto.phone;
    if (dto.birthday !== undefined) profile.birthday = new Date(dto.birthday);
    if (dto.age !== undefined) profile.age = dto.age;
    if (dto.gender !== undefined) profile.gender = dto.gender;
    if (dto.profilePictureUrl !== undefined)
      profile.profilePictureUrl = dto.profilePictureUrl;

    // Cargar socials desde la base para asegurarnos que tiene el id
    let socials = await this.socialsRepository.findOne({
      where: { userProfile: { id: profile.id } },
    });

    if (!socials) {
      // Si no existe, crear uno nuevo y vincularlo
      socials = new UserSocials();
      socials.userProfile = profile;
    }

    // Actualizar campos sociales solo si vienen en dto
    if (dto.whatsappNumber !== undefined)
      socials.whatsappNumber = dto.whatsappNumber;
    if (dto.facebook !== undefined) socials.facebook = dto.facebook;
    if (dto.instagram !== undefined) socials.instagram = dto.instagram;
    if (dto.tiktok !== undefined) socials.tiktok = dto.tiktok;
    if (dto.twitterX !== undefined) socials.twitterX = dto.twitterX;
    if (dto.snapchat !== undefined) socials.snapchat = dto.snapchat;
    if (dto.linkedin !== undefined) socials.linkedin = dto.linkedin;
    if (dto.youtube !== undefined) socials.youtube = dto.youtube;
    if (dto.pinterest !== undefined) socials.pinterest = dto.pinterest;

    await this.socialsRepository.save(socials);
    await this.profileRepository.save(profile);
    return this.userRepository.save(user);
  }
}
