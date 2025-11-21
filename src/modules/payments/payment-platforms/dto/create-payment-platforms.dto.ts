import { IsString, IsOptional, IsBoolean, IsUUID, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentPlatformsDto {
  @IsUUID()
  @IsOptional()
  payment_platform_id: string;

  @ApiProperty({ description: 'Código único de la plataforma de pago', example: 'BANK' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiProperty({ description: 'Título de la plataforma de pago', example: 'Bank Platform' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Descripción de la plataforma de pago',
    example: 'Plataforma bancaria tradicional',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Indica si la plataforma de pago está activa', example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-18T12:24:18.058Z',
    required: false,
  })
  @IsOptional()
  created_at?: string;

  @ApiProperty({
    description: 'Lista de proveedores asociados',
    required: false,
    example: [],
  })
  @IsOptional()
  providers?: any[];

  @ApiProperty({
    description: 'Cuentas financieras asociadas',
    required: false,
    example: [],
  })
  @IsOptional()
  financialAccounts?: any[];
}
