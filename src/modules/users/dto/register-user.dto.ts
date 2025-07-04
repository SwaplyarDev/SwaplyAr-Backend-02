import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @Transform(({ value, obj }) => value ?? obj.first_name)
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  firstName: string;

  @Transform(({ value, obj }) => value ?? obj.last_name)
  @IsAlpha()
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

  @Transform(({ value, obj }) => value ?? obj.role)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Rol del usuario', example: 'user' })
  role: 'user' | 'admin' | 'super_admin';

  @Transform(({ value, obj }) => value ?? obj.terms_accepted)
  @IsBoolean()
  @ApiProperty({
    description: 'Acepta los terminos y condiciones',
    example: true,
  })
  termsAccepted: boolean;
}
