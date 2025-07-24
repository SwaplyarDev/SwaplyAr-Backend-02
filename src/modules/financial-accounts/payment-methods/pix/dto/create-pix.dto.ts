import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePixDto {
  @ApiProperty({ description: 'ID del banco virtual', example: '123' })
  @IsString()
  virtualBankId: string;
  
  @IsString()
  @ApiProperty({ description: 'Clave del pix', example: '123' })
  pixKey: string;
  
  @IsString()
  @ApiProperty({ description: 'Valor del pix', example: '123' })
  pixValue: string;
  
  @IsString()
  @ApiProperty({ description: 'CPF', example: '123' })
  cpf: string;
}
