import { IsNotEmpty, IsNumberString, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyWhatsAppOtpDto {
  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+5491123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+\d{10,15}$/, {
    message: 'El teléfono debe tener el formato internacional, ej: +5491123456789',
  })
  phone: string;

  @ApiProperty({
    description: 'Código de verificación',
    example: '123456',
  })
  @Length(6, 6)
  @IsNumberString({ no_symbols: true })
  @IsString()
  code: string;
}
