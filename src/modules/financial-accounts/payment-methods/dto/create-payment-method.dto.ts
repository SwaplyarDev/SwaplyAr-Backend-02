import { Platform } from 'src/enum/platform.enum';
import { CreateBankDto } from '../bank/dto/create-bank.dto';
import { CreatePixDto } from '../pix/dto/create-pix.dto';
import { CreateReceiverCryptoDto } from '../receiver-crypto/dto/create-receiver-crypto.dto';
import { CreateVirtualBankDto } from '../virutal-bank/dto/create-virtual-bank.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'ID de la plataforma', example: '123' })
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
}
