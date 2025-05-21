import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { Amount } from './amounts/entities/amount.entity';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly financialAccountService: FinancialAccountsService,
    private readonly amountService: AmountsService,
    private readonly proofOfPaymentService: ProofOfPaymentsService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    file: FileUploadDTO,
  ) {
    const createAt = new Date();
    const finalStatus = 'pending';
    //llama al servicio de financialAccount y le envia el sender y receiver para su creacion o traer sus id
    const financialAccount = await this.financialAccountService.create(
      createTransactionDto.financialAccounts,
    );

    //llama al servicio de amount y le envia los datos del amount para su creacion
    const amount = await this.amountService.create(createTransactionDto.amount);

    //llama al servicio de proofofpayment y le envia la img para su creacion
    const proofOfPayment = await this.proofOfPaymentService.create(file);

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      senderAccount: financialAccount.sender,
      receiverAccount: financialAccount.receiver,
      createdAt: createAt,
      finalStatus: finalStatus,
      amount: amount,
      proofOfPayment: proofOfPayment,
    });

    return await this.transactionsRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionsRepository.find({
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofOfPayment: true,
      },
    });
  }
}
