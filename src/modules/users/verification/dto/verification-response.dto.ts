import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'Nahuel Davila' })
  'profile.name': string;

  @ApiProperty({ example: 'coronajonhatan@gmail.com' })
  'profile.email': string;

  @ApiProperty({ example: '12345678' })
  'profile.dni': string;
}

export class VerificationDataDto {
  @ApiProperty({ example: 'a1729f98-9987-4799-93b1-79012c6ba885' })
  verification_id: string;

  @ApiProperty({ example: '6c2b180f-6ffe-4f0f-a275-c0a644b2eb50' })
  users_id: string;

  @ApiProperty({ example: 'https://...' })
  document_front: string;

  @ApiProperty({ example: 'https://...' })
  document_back: string;

  @ApiProperty({ example: 'https://...' })
  selfie_image: string;

  @ApiProperty({ 
    enum: ['pending', 'verified', 'rejected', 'resend-data'],
    example: 'verified',
  })
  verification_status: 'pending' | 'verified' | 'rejected' | 'resend-data';

  @ApiPropertyOptional({ example: 'Documento ilegible o dañado', nullable: true })
  note_rejection?: string | null;

  @ApiPropertyOptional({ example: '2025-07-28T15:58:23.252Z', nullable: true, type: String, format: 'date-time' })
  verified_at?: string | null;

  @ApiProperty({ example: '2025-07-28T15:49:56.108Z', type: String, format: 'date-time' })
  created_at: string;

  @ApiProperty({ example: '2025-07-28T15:58:23.285Z', type: String, format: 'date-time' })
  updated_at: string;

  @ApiPropertyOptional({ type: () => UserProfileDto, nullable: true })
  user?: UserProfileDto | null;
}

export class GetVerificationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Verificación obtenida correctamente' })
  message: string;

  @ApiProperty({ type: () => VerificationDataDto })
  data: VerificationDataDto;
}
