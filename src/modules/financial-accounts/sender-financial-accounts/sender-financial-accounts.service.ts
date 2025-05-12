import { Injectable } from '@nestjs/common';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodService } from '@financial-accounts/payment-methods/payment-method.service';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';
import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';

@Injectable()
export class SenderFinancialAccountsService {
constructor(@InjectRepository(SenderFinancialAccount)
private readonly senderRepository : Repository<SenderFinancialAccount>,
private readonly paymentMethodService : PaymentMethodService){}

  async create(createSenderFinancialAccountDto: CreateSenderFinancialAccountDto) {
const{paymentMethod}=createSenderFinancialAccountDto;

    const newPaymentMethod = await this.paymentMethodService.create(paymentMethod); // lo guarda en la tabla payment methods
   

  // Crear el objeto SenderFinancialAccount
  const data = this.senderRepository.create({
    ...createSenderFinancialAccountDto,
    paymentMethod: newPaymentMethod, // Asigna el método de pago correctamente
  });

   return await this.senderRepository.save(data); // lo guarda en la tabla financial accounts

  }

  async findAll() {
    return await this.senderRepository.find({relations: {paymentMethod:true}});
  }

  async findOne(id: string) {
    return await this.senderRepository.findOne({where:{id}});
  }

  
}
