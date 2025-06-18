import { Platform } from 'src/enum/platform.enum';
import { CreateBankDto } from '../bank/dto/create-bank.dto';
import { CreatePixDto } from '../pix/dto/create-pix.dto';
import { CreateReceiverCryptoDto } from '../receiver-crypto/dto/create-receiver-crypto.dto';
import { CreateVirtualBankDto } from '../virutal-bank/dto/create-virtual-bank.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'ID de la plataforma' , example: '123'})
  platformId: Platform; 

  // Discriminador para identificar el tipo de método de pago
  @ApiProperty({ description: 'Metodo de pago' , example: 'bank'})
  method: 'bank' | 'pix' | 'receiver-crypto' | 'virtual-bank';

  @ApiProperty({ description: 'Banco' , example: '123'})
  bank?: CreateBankDto;

  @ApiProperty({ description: 'Pix' , example: '123'})
  pix?: CreatePixDto;

  @ApiProperty({ description: 'Cuenta receptora' , example: '123'})
    receiverCrypto?: CreateReceiverCryptoDto;

  @ApiProperty({ description: 'Banco virtual' , example: '123'})
  virtualBank?: CreateVirtualBankDto;
}
