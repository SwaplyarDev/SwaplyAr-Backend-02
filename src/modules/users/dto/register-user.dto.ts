import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: 'user' | 'admin' | 'super_admin';

  @IsBoolean()
  termsAccepted: boolean;
}
