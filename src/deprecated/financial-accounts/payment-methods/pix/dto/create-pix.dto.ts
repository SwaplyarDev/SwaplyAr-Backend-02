import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePixDto {
  @ApiProperty({ description: 'ID del banco virtual', example: '123' })
  @IsOptional()
  @IsString()
  pixId: string;

  @ApiProperty({ description: 'Clave del pix', example: '123' })
  @IsOptional()
  @IsString()
  pixKey: string;

  @ApiProperty({ description: 'Valor del pix', example: '123' })
  @IsOptional()
  @IsString()
  pixValue: string;

  @ApiProperty({ description: 'CPF', example: '123' })
  @IsOptional()
  @IsString()
  cpf: string;
}
