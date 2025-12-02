import { PartialType } from '@nestjs/mapped-types';
import { CreateRegretDto } from './create-regret.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRegretDto extends PartialType(CreateRegretDto) {
  @ApiPropertyOptional({ description: 'Apellido del usuario', example: 'Davila' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ description: 'Email del usuario', example: 'nahuel@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Telefono del usuario', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Descripción del arrepentimiento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ID del comprobante de pago asociado' })
  @IsOptional()
  @IsString()
  payment_info_id?: string;
}
