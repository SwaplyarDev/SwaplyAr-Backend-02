import { UpdateAdminProfileDto } from '@admin/profiles/dto/update-admin-profile.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  // Obtener todos los usuarios registrados (ADMIN)
  async findAll() {
    const profiles = await this.profileRepository.find({
      relations: ['user', 'user.locations'],
    });

    if (!profiles || profiles.length === 0) {
      throw new NotFoundException(`No se encontraron usuarios`);
    }

    // Mapeo de los datos a la estructura deseada
    const mappedProfiles = profiles.map((profile) => {
      return {
        fechaRegistro: profile.user.createdAt,
        userId: profile.user.id,
        profileId: profile.id,
        nombre: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        telefono: profile.phone,
        pais: profile.user.locations?.[0]?.country || null,
      };
    });

    return {
      message: 'Perfiles obtenidos correctamente',
      result: mappedProfiles,
    };
  }

  async updateAdminProfile(profileId: string, updateProfileDto: UpdateAdminProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) return null;

    Object.assign(profile, updateProfileDto);

    await this.profileRepository.save(profile);

    const reloadedProfile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!reloadedProfile) {
      throw new NotFoundException('Perfil no encontrado después de actualizar');
    }

    return {
      message: 'Perfil actualizado correctamente',
      result: {
        profileId: reloadedProfile.id,
        userId: reloadedProfile.user.id,
        firstName: reloadedProfile.firstName,
        lastName: reloadedProfile.lastName,
        nickName: reloadedProfile.nickName,
        email: reloadedProfile.email,
        phone: reloadedProfile.phone,
      },
    };
  }

  async deleteUserById(id: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id } },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${id} no encontrado`);
    }

    await this.profileRepository.remove(profile);

    return { message: 'User profile deleted successfully!' };
  }
}
