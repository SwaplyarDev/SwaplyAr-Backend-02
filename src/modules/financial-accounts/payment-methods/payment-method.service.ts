import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankService } from './bank/bank.service';
import { PixService } from './pix/pix.service';
import { ReceiverCryptoService } from './receiver-crypto/receiver-crypto.service';
import { VirtualBankService } from './virutal-bank/virtual-bank.service';

@Injectable()
export class PaymentMethodService {
constructor(private readonly bankService: BankService,
  private readonly pixService: PixService,
  private readonly receiverCryptoService: ReceiverCryptoService,
  private readonly virtualBankService: VirtualBankService,
){}


  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const {bank,pix,receiverCrypto,virtualBank,method,platformId} = createPaymentMethodDto
    

switch(method){
  case 'bank':
    if(!bank) throw new BadRequestException("bank es requerido")
    const newBank = await this.bankService.create(bank,platformId)
    return  newBank;

    case "pix":
    if(!pix) throw new BadRequestException("pix es requerido")
    const newPix = await this.pixService.create(pix,platformId)
    return  newPix;

    case "receiver-crypto":
    if(!receiverCrypto) throw new BadRequestException("receiver-crypto es requerido")
    const newReceiverCrypto = await this.receiverCryptoService.create(receiverCrypto,platformId)
    return newReceiverCrypto;

    case "virtual-bank":
    if(!virtualBank) throw new BadRequestException("virtual-bank es requerido")
      const newVirtualBank = await this.virtualBankService.create(virtualBank,platformId)
    return newVirtualBank;
  default:
    throw new BadRequestException("El metodo de pago no es valido")

  }
}

  findAll() {
    return `This action returns all paymentMethod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
