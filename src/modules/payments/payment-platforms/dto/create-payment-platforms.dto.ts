import { IsString, IsOptional, IsBoolean, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentPlatformDto {
  @ApiProperty({ description: 'Código único de la plataforma de pago', example: 'BANK' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiProperty({ description: 'Título de la plataforma de pago', example: 'Bank Platform' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Descripción de la plataforma de pago', example: 'Plataforma bancaria tradicional' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Indica si la plataforma de pago está activa', example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
