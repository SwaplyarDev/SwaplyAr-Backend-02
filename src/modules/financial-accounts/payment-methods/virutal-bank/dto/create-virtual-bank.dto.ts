import { ApiProperty } from '@nestjs/swagger';

export class CreateVirtualBankDto {
  @ApiProperty({ description: 'Moneda' , example: 'ARS'})
  currency: string;
  @ApiProperty({ description: 'Email de la cuenta' , example: 'nahuel@gmail.com'})
  emailAccount: string;
  @ApiProperty({ description: 'Codigo de transferencia' , example: '123'})
  transferCode: string;
}
