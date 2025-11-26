import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '@users/entities/user-verification.entity';
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserVerificationDto {
  @ApiProperty({ example: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d' })
  verification_id: string;

  @ApiProperty({ example: 'https://example.com/front.png' })
  document_front: string;

  @ApiProperty({ example: 'https://example.com/back.png' })
  document_back: string;

  @ApiProperty({ example: 'https://example.com/selfie.png' })
  selfie_image: string;

  @ApiProperty({ example: 'resend-data' })
  verification_status: string;

  @ApiProperty({ example: 'null' })
  note_rejection: string;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  verified_at: Date;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-09-24T00:00:00.000Z' })
  updated_at: Date;
}

export class AdminProfileResultDto {
  @ApiProperty({
    description: 'Fecha de registro del usuario',
    example: '2025-09-25T14:42:52.378Z',
  })
  fechaRegistro: Date;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
  })
  userId: string;

  @ApiProperty({
    description: 'ID del perfil',
    example: 'e997eb7b-dc81-4a3b-91f4-784bd76da2d2',
  })
  profileId: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+573001112233',
  })
  telefono: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Colombia',
  })
  pais: string;

  @ApiProperty({
    type: UserVerificationDto,
  })
  ultimaVerificacion: UserVerificationDto;
}

export class AdminProfileResponseDto {
  @ApiProperty({ example: 'Perfiles obtenidos correctamente' })
  message: string;

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ type: [AdminProfileResultDto] })
  result: AdminProfileResultDto;
}

export class GetAdminProfilesQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado de verificación',
    enum: VerificationStatus,
    example: 'pending',
  })
  @IsOptional()
  @IsEnum(VerificationStatus, {
    message: 'El status debe ser uno de: pending, verified, rejected, resend-data',
  })
  status?: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
