import { IsEmail, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Apodo o nickname del usuario',
    example: 'JPDev',
  })
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'juanperez@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+573001112233',
  })
  @IsOptional()
  @IsPhoneNumber('CO')
  phone?: string;
}
