import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserLocationDto {
  @ApiProperty({ example: 'Colombia', description: 'País del usuario' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Antioquia', description: 'Departamento o estado' })
  @IsString()
  department: string;

  @ApiProperty({ example: '050021', description: 'Código postal' })
  @IsString()
  postalCode: string; // obligatorio como los demás

  @ApiProperty({ example: '2025-09-24', description: 'Fecha asociada a la ubicación (opcional)' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    example: 'JoseDev',
    description: 'Apodo del usuario',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    type: UpdateUserLocationDto,
    description: 'Información de ubicación del usuario',
    example: {
      country: 'Colombia',
      department: 'Antioquia',
      postalCode: '050021',
      date: '2025-09-24',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserLocationDto)
  location?: UpdateUserLocationDto;
}

export class UpdateUserPhotoDto {
  @ApiProperty({ example: 'Colombia', description: 'País del usuario' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Antioquia', description: 'Departamento o estado' })
  @IsString()
  department: string;

  @ApiProperty({ example: '050021', description: 'Código postal' })
  @IsString()
  postalCode: string; // obligatorio como los demás

  @ApiProperty({ example: '2025-09-24', description: 'Fecha asociada a la ubicación (opcional)' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen a subir',
  })
  file: any;
}

export class UploadImageResultDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/dy1jiclwg/image/upload/v1759156800/profile-pictures/profile_d8e5fcb1-cf4b-4de9-823a-b075dfadaca2_1759156797456.png',
    description: 'URL pública de la imagen subida',
  })
  imgUrl: string;
}

export class UploadImageResponseDto {
  @ApiProperty({
    example: 'Imagen actualizada correctamente',
    description: 'Mensaje de confirmación',
  })
  message: string;

  @ApiProperty({ type: () => UploadImageResultDto })
  result: UploadImageResultDto;
}