import { ApiProperty } from '@nestjs/swagger';

export class VerificationIdsDto {
  @ApiProperty({ example: '2a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d' })
  verification_id: string;
}

export class UserLocationDto {
  @ApiProperty({ example: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d' })
  id: string;

  @ApiProperty({ example: 'Colombia' })
  country: string;

  @ApiProperty({ example: 'Antioquia' })
  department: string;

  @ApiProperty({ example: '050021' })
  postalCode: string;

  @ApiProperty({
    example: '2025-09-24T00:00:00.000Z',
  })
  date: Date;
}

export class SocialsDto {
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

export class UserResponseDto {
  @ApiProperty({ example: 'd8e5fcb1-cf4b-4de9-823a-b075dfadaca22' })
  id: string;

  @ApiProperty({
    type: [UserLocationDto],
  })
  locations: UserLocationDto[];

  @ApiProperty({
    type: [VerificationIdsDto],
  })
  verifications: VerificationIdsDto[];

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: true })
  termsAccepted: boolean;

  @ApiProperty({ example: '2025-09-25T14:42:02.386Z' })
  createdAt: Date;

  @ApiProperty({ nullable: true, example: null })
  validatedAt: Date | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isValidated: boolean;

  @ApiProperty({ example: false })
  userValidated: boolean;
}

export class ProfileResponseDto {
  @ApiProperty({ example: '3305af05-9a75-46b7-8f82-1cdd10af47de' })
  id: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'Nahuel' })
  firstName: string;

  @ApiProperty({ example: 'Davila' })
  lastName: string;

  @ApiProperty({ example: 'JoseDev' })
  nickName: string;

  @ApiProperty({ example: 'coronajonhatan@gmail.com' })
  email: string;

  @ApiProperty({ nullable: true, example: null })
  identification: string | null;

  @ApiProperty({ nullable: true, example: null })
  phone: string | null;

  @ApiProperty({ nullable: true, example: '1990-01-01T00:00:00.000Z' })
  birthday: Date | null;

  @ApiProperty({ nullable: true, example: 35 })
  age: number | null;

  @ApiProperty({ nullable: true, example: 'M' })
  gender: string | null;

  @ApiProperty({ nullable: true, example: '2025-09-25T14:42:02.386Z' })
  lastActivity: Date | null;

  @ApiProperty({ type: SocialsDto })
  socials: SocialsDto;

  @ApiProperty({ nullable: true, example: 'https://example.com/profile.jpg' })
  profilePictureUrl: string | null;
}
