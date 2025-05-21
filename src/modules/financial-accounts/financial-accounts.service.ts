import { Injectable } from '@nestjs/common';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import { SenderFinancialAccountsService } from './sender-financial-accounts/sender-financial-accounts.service';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts/receiver-financial-accounts.service';

@Injectable()
export class FinancialAccountsService {
  constructor(
    private readonly senderService: SenderFinancialAccountsService,
    private readonly receiverService: ReceiverFinancialAccountsService,
  ) {}

  async create(createFinancialAccountDto: CreateFinancialAccountDto) {
    const { senderAccount, receiverAccount } = createFinancialAccountDto;

    const receiver = await this.receiverService.create(receiverAccount); // lo guarda en la tabla financial accounts
    const sender = await this.senderService.create(senderAccount); // lo guarda en la tabla financial accounts

    return { sender, receiver }; //retorna un objeto con los dos accounts
  }

  async findAllReceiver() {
    return await this.receiverService.findAll();
  }

  async findAllSender() {
    return await this.senderService.findAll();
  }

  async findOneSender(id: string) {
    return await this.senderService.findOne(id);
  }

  async findOneReceiver(id: string) {
    return await this.receiverService.findOne(id);
  }
}
