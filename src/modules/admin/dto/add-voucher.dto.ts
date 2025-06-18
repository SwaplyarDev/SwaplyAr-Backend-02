import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVoucherDto {
  @ApiProperty({ description: 'ID de la transaccion' , example: '123'})
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Comprobante de la transaccion' , example: 'base64'})
  comprobante?: string; 
}
