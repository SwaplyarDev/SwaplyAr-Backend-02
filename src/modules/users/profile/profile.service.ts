import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { Repository } from 'typeorm';
import { UserLocation } from '@users/entities/user-location.entity';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { FileUploadDTO } from 'src/modules/file-upload/dto/file-upload.dto';
import { UpdateUserProfileDto } from './dto/udpate-profile.dto';
import { UserSocials } from '@users/entities/user-socials.entity';
import { UpdateUserSocialsDto } from './dto/update-user-socials.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserLocation)
    private readonly locationRepository: Repository<UserLocation>,
    @InjectRepository(UserSocials)
    private readonly socialsRepository: Repository<UserSocials>,

    private readonly fileUploadService: FileUploadService,
  ) {}

  async getUserProfileById(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'user.locations', 'socials'],
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado`);
    }

    return profile;
  }

  // Obtener un usuario mediante su email dentro de profile
  async findByEmail(email: string) {
    const profile = await this.profileRepository.findOne({
      where: { email }, // email de UserProfile
      relations: ['user', 'user.locations'], // incluir relaciones necesarias
    });

    if (!profile) {
      throw new NotFoundException(`El usuario con email ${email} no existe`);
    }

    return profile;
  }

  //Cambiar el email del usuario registrado ADMIN
  async updateEmail(userId: string, newEmail: string): Promise<UserProfile> {
    // Buscar el perfil usando la relación con User
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado`);
    }

    // Validar si ya existe otro perfil con el mismo email
    const existing = await this.profileRepository.findOneBy({
      email: newEmail,
    });

    if (existing && existing.user.id !== userId) {
      throw new ConflictException('Ese email ya está en uso');
    }

    profile.email = newEmail;

    return this.profileRepository.save(profile);
  }
  // Actualiza el numero de telefono del usuario conectado
  async updatePhone(userId: string, phone: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado`);
    }

    if (profile.phone === phone) {
      throw new BadRequestException('Este número ya está registrado en tu perfil.');
    }

    profile.phone = phone;

    return this.profileRepository.save(profile);
  }

  async updateUserProfile(userId: string, updateDto: UpdateUserProfileDto): Promise<UserProfile> {
    // ya no puede ser null
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'user.locations'],
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado`);
    }

    // 🔹 Actualizar nickname si viene en el DTO
    if (updateDto.nickname !== undefined) {
      profile.nickName = updateDto.nickname;
    }

    // 🔹 Actualizar ubicación si viene en el DTO
    if (updateDto.location) {
      const user = profile.user;
      let userLocation = user.locations?.[0] ?? null;

      if (userLocation) {
        if (updateDto.location.country !== undefined) {
          userLocation.country = updateDto.location.country;
        }
        if (updateDto.location.department !== undefined) {
          userLocation.department = updateDto.location.department;
        }
        if (updateDto.location.postalCode !== undefined) {
          userLocation.postalCode = updateDto.location.postalCode;
        }
        if (updateDto.location.date !== undefined) {
          userLocation.date = new Date(updateDto.location.date);
        }
      } else {
        userLocation = this.locationRepository.create({
          country: updateDto.location.country,
          department: updateDto.location.department,
          postalCode: updateDto.location.postalCode,
          date: updateDto.location.date ? new Date(updateDto.location.date) : new Date(),
          user,
        });
      }

      await this.locationRepository.save(userLocation);
    }

    // 🔹 Guardar cambios generales en el perfil
    await this.profileRepository.save(profile);

    // 🔹 Recargar perfil para asegurar que las relaciones estén actualizadas
    const updatedProfile = await this.profileRepository.findOne({
      where: { id: profile.id },
      relations: ['user', 'user.locations'],
    });

    if (!updatedProfile) {
      // Esto casi nunca ocurre, pero es una garantía de seguridad
      throw new NotFoundException(`No se pudo cargar el perfil actualizado`);
    }

    return updatedProfile;
  }

  // actualizar imagen del perfil
  async updateUserPictureById(userId: string, file: Express.Multer.File) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Perfil con ID ${userId} no encontrado`);
    }

    const folder = 'profile-pictures';
    const fileName = `profile_${userId}_${Date.now()}`;

    const fileDTO: FileUploadDTO = {
      fieldName: file.fieldname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };

    const imgUrl = await this.fileUploadService.uploadFile(fileDTO, folder, fileName);
    if (!imgUrl) {
      throw new Error('Error al subir la imagen');
    }

    profile.profilePictureUrl = imgUrl;
    await this.profileRepository.save(profile);
    console.log('el perfi', profile);

    return { imgUrl };
  }

  async updateUserSocials(userId: string, socialsDto: UpdateUserSocialsDto): Promise<UserSocials> {
    // Buscar el perfil y cargar las relaciones de socials
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['socials'],
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado`);
    }

    let socials = profile.socials;

    // Si no existen, crear nueva entidad
    if (!socials) {
      socials = this.socialsRepository.create({ userProfile: profile });
    }

    // Actualizar solo los campos enviados
    Object.keys(socialsDto).forEach((key) => {
      if (socialsDto[key] !== undefined) {
        socials[key] = socialsDto[key];
      }
    });

    // Guardar
    return this.socialsRepository.save(socials);
  }
}
