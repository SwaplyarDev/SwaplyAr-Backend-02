import { Injectable } from '@nestjs/common';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SenderFinancialAccountsService {
constructor(@InjectRepository(SenderFinancialAccount)
private readonly senderRepository : Repository<SenderFinancialAccount>){}

  async create(createSenderFinancialAccountDto: CreateSenderFinancialAccountDto) {

    const data = this.senderRepository.create(createSenderFinancialAccountDto);
    return await this.senderRepository.save(data); // lo guarda en la tabla financial accounts

    
  }

  async findAll() {
    return await this.senderRepository.find();
  }

  async findOne(id: string) {
    return await this.senderRepository.findOne({where:{id}});
  }

  
}
