import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { Repository } from 'typeorm';
import { UpdateUserLocationDto } from './dto/location.profile.dto';
import { UserLocation } from '@users/entities/user-location.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserLocation)
    private readonly locationRepository: Repository<UserLocation>,
  ) {}

  // Obtener todos los usuarios registrado siendo ADMIN
  async findAll(): Promise<UserProfile[]> {
    const usuarios = await this.profileRepository.find({ relations: ['user'] });
    if (!usuarios) {
      throw new NotFoundException(`No se encontraron usuarios`);
    }
    return usuarios;
  }

  //Obtener un usuario mediante su ID ADMIN
  async findById(id: string): Promise<UserProfile | null> {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`El usuario con el id ${id} no existe`);
    }
    return profile;
  }

  // Obtener un usuario mediante su email
  async findByEmail(email: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOneBy({ email });
    if (!profile) {
      throw new NotFoundException(`El usuario con email ${email} no existe`);
    }
    return profile;
  }

  /* async updateNickname(userId: string, nickname: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOneBy({ id: userId });
    if (!profile) {
      throw new NotFoundException(`Perfil con ID ${userId} no encontrado`);
    }

    profile.nickname = nickname;
    return this.profileRepository.save(profile);
  } */

  //Cambiar el email del usuario registrado ADMIN
  async updateEmail(userId: string, newEmail: string): Promise<UserProfile> {
    // Buscar el perfil usando la relación con User
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil con ID de usuario ${userId} no encontrado`,
      );
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
      throw new NotFoundException(
        `Perfil con ID de usuario ${userId} no encontrado`,
      );
    }
    // Si el número ya es el mismo, no permitir actualizar
    if (profile.phone === phone) {
      throw new BadRequestException(
        'Este número ya está registrado en tu perfil.',
      );
    }

    profile.phone = phone;

    return this.profileRepository.save(profile);
  }

  // actualiza la localizacion del usuario logeado
  async updateLocation(
    userId: string,
    locationDto: UpdateUserLocationDto,
  ): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'user.locations'],
    });
    console.log('profile', profile);

    if (!profile) {
      throw new NotFoundException(
        `Perfil con ID de usuario ${userId} no encontrado`,
      );
    }

    const user = profile.user;
    let userLocation = user.locations?.[0] ?? null;

    if (userLocation) {
      if (locationDto.country !== undefined) {
        userLocation.country = locationDto.country;
      }
      if (locationDto.department !== undefined) {
        userLocation.department = locationDto.department;
      }
      if (locationDto.date !== undefined) {
        userLocation.date = new Date(locationDto.date);
      }
    } else {
      userLocation = this.locationRepository.create({
        country: locationDto.country,
        department: locationDto.department,
        date: locationDto.date ? new Date(locationDto.date) : new Date(),
        user,
      });
    }

    await this.locationRepository.save(userLocation);

    return profile;
  }

  async deleteUserById(id: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id } },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil con ID de usuario ${id} no encontrado`,
      );
    }

    await this.profileRepository.remove(profile); // elimina solo el perfil, no el user

    return { message: 'User profile deleted successfully!' };
  }
}
