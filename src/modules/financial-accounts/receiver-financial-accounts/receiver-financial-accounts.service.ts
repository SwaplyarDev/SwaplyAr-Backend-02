import { Injectable } from '@nestjs/common';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto'; 
import { UpdateReceiverFinancialAccountDto } from './dto/update-receiver-financial-account.dto';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodService } from '@financial-accounts/payment-methods/payment-method.service';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@Injectable()
export class ReceiverFinancialAccountsService {
constructor(  @InjectRepository(ReceiverFinancialAccount)
     private readonly receiverRepository : Repository<ReceiverFinancialAccount>,
    private readonly paymentMethodService : PaymentMethodService){}

  async create(createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto) {
     const{paymentMethod}=createReceiverFinancialAccountDto;

      const newPaymentMethod = await this.paymentMethodService.create(paymentMethod); // lo guarda en la tabla payment methods
 
    const data = this.receiverRepository.create({...createReceiverFinancialAccountDto,paymentMethod:newPaymentMethod}); // lo guarda en la tabla financial accounts
   return await this.receiverRepository.save(data); // lo guarda en la tabla financial accounts 
    
  }

  async findAll() {
    return await this.receiverRepository.find({relations:{paymentMethod:true}}); // lo guarda en la tabla financial accounts
  }

  async findOne(id: string) {
    return await this.receiverRepository.findOne({where:{id}}); // lo guarda en la tabla financial accounts
  }


}
