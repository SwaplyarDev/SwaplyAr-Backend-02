import { Injectable } from '@nestjs/common';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto'; 
import { UpdateReceiverFinancialAccountDto } from './dto/update-receiver-financial-account.dto';

@Injectable()
export class ReceiverFinancialAccountsService {
  create(createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto) {
    return 'This action adds a new ReceiverFinancialAccount';
  }

  findAll() {
    return `This action returns all ReceiverFinancialAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ReceiverFinancialAccount`;
  }

  update(id: number, updateReceiverFinancialAccountDto: UpdateReceiverFinancialAccountDto) {
    return `This action updates a #${id} ReceiverFinancialAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} ReceiverFinancialAccount`;
  }
}
