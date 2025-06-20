import { ApiProperty } from '@nestjs/swagger';

export class CreatePixDto {
  @ApiProperty({ description: 'ID del banco virtual' , example: '123'})
  virtualBankId: string;
  @ApiProperty({ description: 'Clave del pix' , example: '123'})
  pixKey: string;
  @ApiProperty({ description: 'Valor del pix' , example: '123'})
  pixValue: string;
  @ApiProperty({ description: 'CPF' , example: '123'})
  cpf: string;
}
