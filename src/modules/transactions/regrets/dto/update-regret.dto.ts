import { PartialType } from '@nestjs/mapped-types';
import { CreateRegretDto } from './create-regret.dto';
import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegretDto extends PartialType(CreateRegretDto) {
  @Transform(({ value, obj }) => value ?? obj.transaction_id)
  @IsString()
  @ApiProperty({ description: 'ID de la transaccion', example: '123' })
  transaction_id: string;

  @Transform(({ value, obj }) => value ?? obj.last_name)
  @IsString()
  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  last_name: string;

  @Transform(({ value, obj }) => value ?? obj.email)
  @IsEmail()
  @ApiProperty({
    description: 'Email del usuario',
    example: 'nahuel@gmail.com',
  })
  email: string;

  @Transform(({ value, obj }) => value ?? obj.phone_number)
  @IsString()
  @ApiProperty({ description: 'Telefono del usuario', example: '1234567890' })
  phone_number: string;
}
