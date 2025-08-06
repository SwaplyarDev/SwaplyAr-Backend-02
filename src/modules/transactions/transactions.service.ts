import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
import { instanceToPlain } from 'class-transformer';

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

  const financialAccount = await this.financialAccountService.create(
    createTransactionDto.financialAccounts,
  );

  const amount = await this.amountService.create(createTransactionDto.amount);

  const proofOfPayment = await this.proofOfPaymentService.create(file);

  const transaction = this.transactionsRepository.create({
    ...createTransactionDto,
    senderAccount: financialAccount.sender,
    receiverAccount: financialAccount.receiver,
    createdAt: createAt,
    amount,
    proofOfPayment,
  });

  const savedTransaction = await this.transactionsRepository.save(transaction);

  // Ocultar userId antes de devolver la respuesta
  return instanceToPlain(savedTransaction);
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

  async getTransactionByEmail(
    transactionId: string,
    userEmail: string,
  ): Promise<Transaction> {
    if (!userEmail) {
      throw new ForbiddenException('Email is required');
    }

    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
      relations: {
        senderAccount: {
          paymentMethod: true,
        },
        receiverAccount: {
          paymentMethod: true,
        },
        amount: true,
        proofOfPayment: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (
      transaction.createdBy !== userEmail &&
      transaction.receiverAccount?.email !== userEmail &&
      transaction.senderAccount?.email !== userEmail
    ) {
      throw new ForbiddenException('Unauthorized access to this transaction');
    }

    return transaction;
  }
}
