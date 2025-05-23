import { Platform } from 'src/enum/platform.enum';
import { CreateBankDto } from '../bank/dto/create-bank.dto';
import { CreatePixDto } from '../pix/dto/create-pix.dto';
import { CreateReceiverCryptoDto } from '../receiver-crypto/dto/create-receiver-crypto.dto';
import { CreateVirtualBankDto } from '../virutal-bank/dto/create-virtual-bank.dto';

export class CreatePaymentMethodDto {
  platformId: Platform; // fk de la tabla platform

  // Discriminador para identificar el tipo de método de pago
  method: 'bank' | 'pix' | 'receiver-crypto' | 'virtual-bank';

  bank?: CreateBankDto;
  pix?: CreatePixDto;
  receiverCrypto?: CreateReceiverCryptoDto;
  virtualBank?: CreateVirtualBankDto;
}
