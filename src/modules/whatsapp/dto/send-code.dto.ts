import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendWhatsAppCodeDto {
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
}
