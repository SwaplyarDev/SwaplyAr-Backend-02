import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReceiverDto {
  @ApiProperty({ description: 'Nombre del banco' , example: 'Banco Nacion'})
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Metodo de envio' , example: '1234567890123456789012'})
  sendMethodValue?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Documento del receptor' , example: '1234567890'})
  documentValue?: string;
} 