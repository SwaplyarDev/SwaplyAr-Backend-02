import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @Transform(({ value, obj }) => value ?? obj.first_name)
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/, {
    message: 'El nombre solo puede contener letras',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  firstName: string;

  @Transform(({ value, obj }) => value ?? obj.last_name)
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/, {
    message: 'El nombre solo puede contener letras',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  lastName: string;

  @Transform(({ value, obj }) => value ?? obj.email)
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email del usuario',
    example: 'nahuel@gmail.com',
  })
  email: string;

  @Transform(({ value, obj }) => value ?? obj.terms_accepted)
  @IsBoolean()
  @ApiProperty({
    description: 'Acepta los terminos y condiciones',
    example: true,
  })
  termsAccepted: boolean;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '5b3df863-30c1-4275-9450-fc1945ef73d8',
  })
  id: string;

  @ApiProperty({
    description: 'Rol asignado al usuario dentro del sistema',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Indica si el usuario aceptó los términos y condiciones',
    example: true,
  })
  termsAccepted: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-08-25T12:58:49.259Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de validación del usuario, si aplica',
    example: null,
  })
  validatedAt: string | null;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Indica si el usuario fue validado',
    example: false,
  })
  isValidated: boolean;

  @ApiProperty({
    description: 'Token de refresco del usuario, si existe',
    example: null,
  })
  refreshToken: string | null;
}
