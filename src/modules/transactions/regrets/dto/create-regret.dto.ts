import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegretDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '123' })
  @Transform(({ value, obj }) => value ?? obj.transaction_id)
  @IsString()
  transaction_id: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @Transform(({ value, obj }) => value ?? obj.last_name)
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'nahuel@gmail.com',
  })
  @Transform(({ value, obj }) => value ?? obj.email)
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefono del usuario', example: '1234567890' })
  @Transform(({ value, obj }) => value ?? obj.phone_number)
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'Estado de la transaccion', example: '123' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Nota de la transaccion',
    example: 'Nota de prueba',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
