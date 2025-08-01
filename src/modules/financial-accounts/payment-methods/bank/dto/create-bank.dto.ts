import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ description: 'Moneda utilizada por el banco', example: 'ARS' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Nombre del banco', example: 'Banco Nación' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ description: 'Clave del método de envío', example: 'CBU' })
  @IsString()
  @IsNotEmpty()
  sendMethodKey: string;

  @ApiProperty({ description: 'Valor del método de envío', example: '1234567890123456789012' })
  @IsString()
  @IsNotEmpty()
  sendMethodValue: string;

  @ApiProperty({ description: 'Tipo de documento del titular', example: 'DNI' })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({ description: 'Número de documento del titular', example: '87654321' })
  @IsString()
  @IsNotEmpty()
  documentValue: string;
}



export class UpdateBankDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  sendMethodKey?: string;

  @IsOptional()
  @IsString()
  sendMethodValue?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  documentValue?: string;
}