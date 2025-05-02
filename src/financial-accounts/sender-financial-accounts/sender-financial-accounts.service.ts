import { Injectable } from '@nestjs/common';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';

@Injectable()
export class SenderFinancialAccountsService {
  create(createSenderFinancialAccountDto: CreateSenderFinancialAccountDto) {
    return 'This action adds a new senderFinancialAccount';
  }

  findAll() {
    return `This action returns all senderFinancialAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} senderFinancialAccount`;
  }

  update(id: number, updateSenderFinancialAccountDto: UpdateSenderFinancialAccountDto) {
    return `This action updates a #${id} senderFinancialAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} senderFinancialAccount`;
  }
}
