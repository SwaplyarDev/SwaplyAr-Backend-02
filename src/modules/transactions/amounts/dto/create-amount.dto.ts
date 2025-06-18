import { ApiProperty } from "@nestjs/swagger";

export class CreateAmountDto {
  @ApiProperty({ description: 'Cantidad enviada' , example: 100})
  amountSent: number; 
  @ApiProperty({ description: 'Moneda enviada' , example: 'ARS'})
  currencySent: string; 
  @ApiProperty({ description: 'Cantidad recibida' , example: 100})
  amountReceived: number; 
  @ApiProperty({ description: 'Moneda recibida' , example: 'ARS'})
  currencyReceived: string; 
}
