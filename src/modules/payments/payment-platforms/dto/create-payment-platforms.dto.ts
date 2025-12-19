import { IsString, IsOptional, IsBoolean, Length, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentPlatformsDto {
  @ApiProperty({ description: 'Código único de la plataforma de pago', example: 'bank' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiProperty({ description: 'Título de la plataforma de pago', example: 'Bank Platform' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción de la plataforma de pago',
    example: 'Plataforma bancaria tradicional',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Indica si la plataforma de pago está activa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
