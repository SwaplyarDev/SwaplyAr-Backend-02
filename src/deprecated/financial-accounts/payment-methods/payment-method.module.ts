import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Bank } from './bank/entities/bank.entity';
import { BankService } from './bank/bank.service';
import { PixService } from './pix/pix.service';
import { Pix } from './pix/entities/pix.entity';
import { VirtualBankService } from './virutal-bank/virtual-bank.service';
import { ReceiverCryptoService } from './receiver-crypto/receiver-crypto.service';
import { ReceiverCrypto } from './receiver-crypto/entities/receiver-crypto.entity';
import { VirtualBank } from './virutal-bank/entities/virtual-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, Bank, Pix, ReceiverCrypto, VirtualBank])],
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    BankService,
    PixService,
    VirtualBankService,
    ReceiverCryptoService,
  ],
  exports: [
    PaymentMethodService,
    BankService,
    PixService,
    VirtualBankService,
    ReceiverCryptoService,
  ],
})
export class PaymentMethodModule {}
