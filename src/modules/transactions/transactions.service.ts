import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { Amount } from './amounts/entities/amount.entity';
import { AmountsService } from './amounts/amounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly financialAccountService : FinancialAccountsService,
    private readonly amountService:AmountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {

    const createAt = new Date();
    const finalStatus = 'pending';

 const financialAccount = await this.financialAccountService.create(createTransactionDto.financialAccounts);

const amount = await this.amountService.create(createTransactionDto.amount);

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      senderAccount: financialAccount.sender,
      receiverAccount: financialAccount.receiver,
      createdAt: createAt,
      finalStatus: finalStatus,
      amount: amount,
    });

    const newTransaction = this.transactionsRepository.create(transaction);

    return  await this.transactionsRepository.save(newTransaction);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
