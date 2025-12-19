import { UserVerificationDto } from '@admin/profiles/dto/admin-profile-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LocationsDataDto {
  @ApiProperty({ example: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d' })
  id: string;

  @ApiProperty({ example: 'Colombia' })
  country: string;

  @ApiProperty({ example: 'Antioquia' })
  department: string;

  @ApiProperty({ example: '050021' })
  postalCode: string;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  date: Date;
}

export class UserProfileDataDto {
  @ApiProperty({ example: 'd8e5fcb1-cf4b-4de9-823a-b075dfadaca2' })
  id: string;

  @ApiProperty({ type: [LocationsDataDto] })
  locations: [LocationsDataDto];

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: true })
  termsAccepted: boolean;

  @ApiProperty({ example: '2025-09-25T14:42:02.386Z' })
  createdAt: Date;

  @ApiProperty({ example: null })
  validatedAt: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isValidated: boolean;

  @ApiProperty({ example: false })
  userValidated: boolean;
}

export class SocialsProfileDataDto {
  @ApiProperty({ example: 'e45ca483-76fb-47df-b5ce-295b4bddbf70' })
  id: string;

  @ApiProperty({ example: '+5731134334567' })
  whatsappNumber: string;

  @ApiProperty({ example: 'https://facebook.com/user' })
  facebook: string;

  @ApiProperty({ example: 'https://instagram.com/user' })
  instagram: string;

  @ApiProperty({ example: 'https://tiktok.com/@user' })
  tiktok: string;

  @ApiProperty({ example: 'https://twitter.com/user' })
  twitterX: string;

  @ApiProperty({ example: 'https://snapchat.com/add/user' })
  snapchat: string;

  @ApiProperty({ example: 'https://linkedin.com/in/user' })
  linkedin: string;

  @ApiProperty({ example: 'https://youtube.com/user' })
  youtube: string;

  @ApiProperty({ example: 'https://pinterest.com/user' })
  pinterest: string;
}

export class UpdateUserSocialsResponseDto {
  @ApiProperty({ example: 'Redes sociales actualizadas correctamente' })
  message: string;

  @ApiProperty({ type: SocialsProfileDataDto })
  result: SocialsProfileDataDto;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: '3305af05-9a75-46b7-8f82-1cdd10af47de' })
  id: string;

  @ApiProperty({ type: UserProfileDataDto })
  user: UserProfileDataDto;

  @ApiProperty({ example: 'Nahuel' })
  firstName: string;

  @ApiProperty({ example: 'Davila' })
  lastName: string;

  @ApiProperty({ example: 'JoseDev' })
  nickName: string;

  @ApiProperty({ example: 'coronajonhatan@gmail.com' })
  email: string;

  @ApiProperty({ example: null })
  identification: string;

  @ApiProperty({ example: null })
  phone: string;

  @ApiProperty({ example: null })
  birthday: string;

  @ApiProperty({ example: null })
  age: string;

  @ApiProperty({ example: 'M' })
  gender: string;

  @ApiProperty({ example: null })
  lastActivity: string;

  @ApiProperty({ type: SocialsProfileDataDto })
  socials: SocialsProfileDataDto;

  @ApiProperty({ example: null })
  profilePictureUrl: string;

  @ApiProperty({ type: UserVerificationDto, nullable: true })
  ultimaVerificacion: UserVerificationDto | null;

  @ApiProperty({ example: 'active', description: 'Estatus basado en user.isActive' })
  estatusCuenta: string;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  lastAccess: string;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  ultimoAcceso: string;
}

export class UpdateUserProfileResponseDto {
  @ApiProperty({ example: '3305af05-9a75-46b7-8f82-1cdd10af47de' })
  id: string;

  @ApiProperty({ type: UserProfileDataDto })
  user: UserProfileDataDto;

  @ApiProperty({ example: 'Nahuel' })
  firstName: string;

  @ApiProperty({ example: 'Davila' })
  lastName: string;

  @ApiProperty({ example: 'JoseDev' })
  nickName: string;

  @ApiProperty({ example: 'coronajonhatan@gmail.com' })
  email: string;

  @ApiProperty({ example: null })
  identification: string;

  @ApiProperty({ example: null })
  phone: string;

  @ApiProperty({ example: null })
  birthday: string;

  @ApiProperty({ example: null })
  age: string;

  @ApiProperty({ example: 'M' })
  gender: string;

  @ApiProperty({ example: null })
  lastActivity: string;

  @ApiProperty({ example: null })
  profilePictureUrl: string;
}
