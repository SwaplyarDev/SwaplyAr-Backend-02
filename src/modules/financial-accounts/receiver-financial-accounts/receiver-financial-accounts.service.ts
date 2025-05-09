import { Injectable } from '@nestjs/common';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto'; 
import { UpdateReceiverFinancialAccountDto } from './dto/update-receiver-financial-account.dto';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReceiverFinancialAccountsService {
constructor(  @InjectRepository(ReceiverFinancialAccount)
     private readonly receiverRepository : Repository<ReceiverFinancialAccount>){}

  async create(createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto) {
    const data = this.receiverRepository.create(createReceiverFinancialAccountDto); // lo guarda en la tabla financial accounts
   return await this.receiverRepository.save(data); // lo guarda en la tabla financial accounts 
    
  }

  async findAll() {
    return await this.receiverRepository.find(); // lo guarda en la tabla financial accounts
  }

  async findOne(id: string) {
    return await this.receiverRepository.findOne({where:{id}}); // lo guarda en la tabla financial accounts
  }


}
