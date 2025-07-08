import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCodeDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'nahuel@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Codigo de verificacion', example: '123456' })
  @Length(6, 6)
  @IsNumberString({ no_symbols: true })
  @IsString()
  code: string;
}
