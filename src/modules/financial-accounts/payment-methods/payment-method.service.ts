import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankService } from './bank/bank.service';
import { PixService } from './pix/pix.service';
import { ReceiverCryptoService } from './receiver-crypto/receiver-crypto.service';
import { VirtualBankService } from './virutal-bank/virtual-bank.service';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly bankService: BankService,
    private readonly pixService: PixService,
    private readonly receiverCryptoService: ReceiverCryptoService,
    private readonly virtualBankService: VirtualBankService,
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const { bank, pix, receiverCrypto, virtualBank, method, platformId } =
      createPaymentMethodDto;

    switch (method) {
      case 'bank':
        if (!bank) throw new BadRequestException('bank es requerido');
        const newBank = await this.bankService.create(bank, platformId, method);
        return newBank;

      case 'pix':
        if (!pix) throw new BadRequestException('pix es requerido');
        const newPix = await this.pixService.create(pix, platformId, method);
        return newPix;

      case 'receiver-crypto':
        if (!receiverCrypto)
          throw new BadRequestException('receiver-crypto es requerido');
        const newReceiverCrypto = await this.receiverCryptoService.create(
          receiverCrypto,
          platformId,
          method,
        );
        return newReceiverCrypto;

      case 'virtual-bank':
        if (!virtualBank)
          throw new BadRequestException('virtual-bank es requerido');
        const newVirtualBank = await this.virtualBankService.create(
          virtualBank,
          platformId,
          method,
        );
        return newVirtualBank;
      default:
        throw new BadRequestException('El metodo de pago no es valido');
    }
  }

  async save(paymentMethod: PaymentMethod) {
    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findAllFinancialAccounts() {
    return await this.paymentMethodRepository.find();
  }

  async findAllBank() {
    return await this.bankService.findAll();
  }

  async findAllPix() {
    return await this.pixService.findAll();
  }
}
