import { UpdateAdminProfileDto } from '@admin/profiles/dto/update-admin-profile.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { Repository } from 'typeorm';
import { UserVerification } from '@users/entities/user-verification.entity';
import { VerificationStatus } from '@users/entities/user-verification.entity';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,

    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
  ) {}

  async findAll(status?: VerificationStatus, page: number = 1, limit: number = 10) {
    // Traemos todos los perfiles para mapear/verificar el último estado
    const [profiles] = await this.profileRepository.findAndCount({
      relations: ['user', 'user.verifications', 'user.locations'],
      order: { id: 'ASC' },
    });

    if (!profiles.length) {
      throw new NotFoundException('No se encontraron usuarios');
    }

    // Mapear perfiles con su última verificación
    let mappedProfiles = profiles.map((profile) => {
      const verifications = profile.user.verifications || [];

      const latestVerification =
        verifications.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0] || null;

      return {
        fechaRegistro: profile.user.createdAt,
        userId: profile.user.id,
        profileId: profile.id,
        nombre: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        telefono: profile.phone,
        pais: profile.user.locations?.[0]?.country || null,
        ultimaVerificacion: latestVerification,
      };
    });

    if (status) {
      mappedProfiles = mappedProfiles.filter(
        (p) => p.ultimaVerificacion?.verification_status === status,
      );
    }

    // Total real luego del filtrado
    const total = mappedProfiles.length;

    const startIndex = (page - 1) * limit;
    const paginatedResults = mappedProfiles.slice(startIndex, startIndex + limit);

    return {
      message: 'Perfiles obtenidos correctamente',
      total,
      page,
      limit,
      result: paginatedResults,
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
