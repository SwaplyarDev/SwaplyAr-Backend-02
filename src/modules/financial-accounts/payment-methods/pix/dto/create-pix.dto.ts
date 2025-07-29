import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreatePixDto {
  @ApiProperty({ description: 'ID del banco virtual', example: '123' })
  @IsString()
  @IsNotEmpty()
  virtualBankId: string;

  @ApiProperty({ description: 'Clave del pix', example: '123' })
  @IsString()
  @IsNotEmpty()
  pixKey: string;

  @ApiProperty({ description: 'Valor del pix', example: '123' })
  @IsString()
  @IsNotEmpty()
  pixValue: string;

  @ApiProperty({ description: 'CPF', example: '123' })
  @IsString()
  @IsNotEmpty()
  cpf: string;
}
