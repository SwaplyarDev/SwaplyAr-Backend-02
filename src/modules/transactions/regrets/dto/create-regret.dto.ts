import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegretDto {
  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @Transform(({ value, obj }) => value ?? obj.last_name)
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'e-mail del usuario',
    example: 'nahuel@gmail.com',
  })
  @Transform(({ value, obj }) => value ?? obj.email)
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefono del usuario', example: '+1234567890' })
  @Transform(({ value, obj }) => {
    const phone = value ?? obj.phone_number;
    return phone.startsWith(`+`) ? phone : `+${phone}`;
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'Nota de la transaccion',
    example: 'Nota de prueba',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID de la transaccion', example: 'ZrzUcnGWWr' })
  @Transform(({ value, obj }) => value ?? obj.transaction_id)
  @IsString()
  transaction_id: string;

  @ApiProperty({ description: 'ID de la información de pago', example: 'PjkUcnGWWr' })
  @Transform(({ value, obj }) => value ?? obj.payment_info_id)
  @IsString()
  payment_info_id: string;
}
