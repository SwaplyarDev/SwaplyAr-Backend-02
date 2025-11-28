import { CreateBankDto } from '../bank/dto/create-bank.dto';
import { CreatePixDto } from '../pix/dto/create-pix.dto';
import { CreateReceiverCryptoDto } from '../receiver-crypto/dto/create-receiver-crypto.dto';
import { CreateVirtualBankDto } from '../virutal-bank/dto/create-virtual-bank.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from 'src/enum/platform.enum';
import { VirtualBankType } from 'src/enum/virtual-bank.enum';

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'ID de la plataforma', example: 'bank' })
  @IsEnum(Platform)
  platformId: Platform;

  @ApiProperty({ description: 'Método de pago', example: 'bank' })
  @IsString()
  method: 'bank' | 'pix' | 'receiver-crypto' | 'virtual-bank';

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBankDto)
  bank?: CreateBankDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePixDto)
  pix?: CreatePixDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateReceiverCryptoDto)
  receiverCrypto?: CreateReceiverCryptoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVirtualBankDto)
  virtualBank?: CreateVirtualBankDto;

  @ApiProperty({
    description: 'Tipo de virtual bank (solo aplica si method = virtual-bank)',
    example: VirtualBankType.PayPal,
    required: false,
    enum: VirtualBankType,
  })
  @IsOptional()
  @IsEnum(VirtualBankType, {
    message: 'type debe ser uno de los valores permitidos en VirtualBankType',
  })
  type?: VirtualBankType;
}

export class CreatePaymentMethodBankDataDto {
  @ApiProperty({ example: 'ARS' })
  currency: string;

  @ApiProperty({ example: 'Banco Nación' })
  bankName: string;

  @ApiProperty({ example: 'CBU' })
  sendMethodKey: string;

  @ApiProperty({ example: '1234567890123456789012' })
  sendMethodValue: string;

  @ApiProperty({ example: 'DNI' })
  documentType: string;

  @ApiProperty({ example: '87654321' })
  documentValue: string;
}

export class CreatePaymentMethodResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'bank' })
  platformId: string;

  @ApiProperty({ example: 'bank' })
  method: string;

  @ApiProperty({ type: CreatePaymentMethodBankDataDto })
  bank: CreatePaymentMethodBankDataDto;
}

export class BankPaymentMethodDataResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ARS' })
  currency: string;

  @ApiProperty({ example: 'Banco Nación' })
  bankName: string;

  @ApiProperty({ example: 'CBU' })
  sendMethodKey: string;

  @ApiProperty({ example: '1234567890123456789012' })
  sendMethodValue: string;

  @ApiProperty({ example: 'DNI' })
  documentType: string;

  @ApiProperty({ example: '87654321' })
  documentValue: string;
}

export class PixPaymentMethodDataResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid-virtual-bank' })
  virtualBankId: string;

  @ApiProperty({ example: 'clavePix' })
  pixKey: string;

  @ApiProperty({ example: 'valorPix' })
  pixValue: string;

  @ApiProperty({ example: '12345678900' })
  cpf: string;
}
