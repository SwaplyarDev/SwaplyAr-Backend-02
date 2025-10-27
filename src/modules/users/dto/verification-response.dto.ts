import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName?: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  email: string;

  @ApiProperty({ example: '+54 9 11 2345-6789' })
  phone?: string;

  @ApiProperty({ example: '12345678' })
  identification?: string;

  @ApiProperty({ example: '1990-05-15' })
  birthdate?: string;
}

export class DocumentsDto {
  @ApiProperty({ example: 'https://.../front.png' })
  front: string;

  @ApiProperty({ example: 'https://.../back.png' })
  back: string;

  @ApiProperty({ example: 'https://.../selfie.png' })
  selfie: string;
}

export class VerificationDataDto {
  @ApiProperty({ example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' })
  id: string;

  @ApiProperty({ example: 'bb34d516-4866-4302-8d4b-c3e22a2ca64b' })
  user_id: string;

  @ApiProperty({ type: DocumentsDto })
  documents: DocumentsDto;

  @ApiProperty({
    enum: ['pending', 'verified', 'rejected', 'resend-data'],
    example: 'pending',
  })
  verification_status: 'pending' | 'verified' | 'rejected' | 'resend-data';

  @ApiPropertyOptional({ example: 'Documento ilegible', nullable: true })
  rejection_note?: string | null;

  @ApiProperty({ example: '2025-08-22T01:31:43.733Z', type: String })
  submitted_at: string;

  @ApiProperty({ example: '2025-08-22T01:35:05.634Z', type: String })
  updated_at: string;

  @ApiPropertyOptional({ example: null, nullable: true, type: String })
  verified_at?: string | null;
}

export class GetVerificationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Verificación obtenida correctamente' })
  message: string;

  @ApiProperty({ type: () => VerificationDataDto })
  data: VerificationDataDto;
}

export class VerificationApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Verificación obtenida correctamente' })
  message: string;

  @ApiProperty({ type: VerificationDataDto })
  data: VerificationDataDto;
}
