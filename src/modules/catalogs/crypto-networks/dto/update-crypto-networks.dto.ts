import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCryptoNetworkDto {
  @ApiProperty({ description: 'Código de la red', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  code?: string;

  @ApiProperty({ description: 'Título de la red', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiProperty({ description: 'URL del logo', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Descripción de la red', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Si la red está activa', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
