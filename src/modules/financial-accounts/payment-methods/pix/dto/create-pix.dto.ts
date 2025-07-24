import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class CreatePixDto {
  @ApiProperty({ description: 'ID del banco virtual', example: '123' })
  @IsString()
  @IsEmpty()
  virtualBankId: string;
  
  @ApiProperty({ description: 'Clave del pix', example: '123' })
  @IsString()
  @IsEmpty()
  pixKey: string;
  
  @ApiProperty({ description: 'Valor del pix', example: '123' })
  @IsString()
  @IsEmpty()
  pixValue: string;
  
  @ApiProperty({ description: 'CPF', example: '123' })
  @IsString()
  @IsEmpty()
  cpf: string;
}
