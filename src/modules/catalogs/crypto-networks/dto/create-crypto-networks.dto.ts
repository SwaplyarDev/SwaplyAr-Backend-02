import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCryptoNetworkDto {
  @ApiProperty({
    description: 'Código de la red (ej: TRC20)', 
    example: 'TRC20',
  })
  @IsString()
  @Length(1, 20)
  code: string;

  @ApiProperty({
    description: 'Título de la red',
    example: 'Tron Network (TRC20)',
  })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({
    description: 'URL del logo',
    required: false,
    example: 'https://cdn.example.com/logos/trc20.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({
    description: 'Descripción de la red',
    required: false,
    example: 'Red rápida y económica basada en Tron para transferencias USDT.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Si la red está activa',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
