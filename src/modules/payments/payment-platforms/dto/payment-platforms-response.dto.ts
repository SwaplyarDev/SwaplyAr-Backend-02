import { ApiProperty } from '@nestjs/swagger';

export class PaymentPlatformResponseDto {
  @ApiProperty({
    description: 'ID único de la plataforma de pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  paymentPlatformId: string;

  @ApiProperty({ description: 'Código único de la plataforma', example: 'bank' })
  code: string;

  @ApiProperty({ description: 'Título de la plataforma', example: 'Bank Platform' })
  title: string;

  @ApiProperty({
    description: 'Descripción de la plataforma',
    example: 'Plataforma bancaria tradicional',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Indica si la plataforma está activa', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
