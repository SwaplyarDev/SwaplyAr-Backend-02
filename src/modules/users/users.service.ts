import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserSocials } from './entities/user-socials.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UserRewardsLedger } from '../discounts/entities/user-rewards-ledger.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(UserSocials)
    private socialsRepository: Repository<UserSocials>,
    private rolesService: RolesService,
  ) {}

  // private generateUserCode(): string {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let result = '';
  //   for (let i = 0; i < 8; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  // private async generateUniqueUserCode(): Promise<string> {
  //   let code: string;
  //   let exists: boolean;

  //   do {
  //     code = this.generateUserCode();
  //     exists = !!(await this.userRepository.findOne({ where: { memberCode: code } }));
  //   } while (exists);

  //   return code;
  // }

  async register(userDto: RegisterUserDto): Promise<User> {
    try {
      // Validaciones básicas
      if (!userDto.email) {
        throw new BadRequestException('El email es obligatorio');
      }

      if (!userDto.termsAccepted) {
        throw new BadRequestException('Debes aceptar los términos y condiciones');
      }

      const existing = await this.userRepository.findOne({
        where: {
          profile: {
            email: userDto.email,
          },
        },
        relations: ['profile'],
      });

      if (existing) {
        throw new ConflictException('El correo ya está registrado');
      }

      const user = new User();
      const userProfile = new UserProfile();
      const userRole = await this.rolesService.findByCode('user');

      userProfile.firstName = userDto.firstName;
      userProfile.lastName = userDto.lastName;
      userProfile.email = userDto.email;

      user.profile = userProfile;
      user.termsAccepted = userDto.termsAccepted ?? false;
      user.roles = [userRole];
      user.rewardsLedger = new UserRewardsLedger();

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      console.error('Error al registrar usuario:', error);
      throw new InternalServerErrorException('Error interno al registrar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { profile: { email } },
      relations: { profile: true, roles: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { profile: true, rewardsLedger: true, roles: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: { profile: true, roles: true },
    });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
