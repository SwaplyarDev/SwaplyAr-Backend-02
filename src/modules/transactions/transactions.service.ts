import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { Amount } from './amounts/entities/amount.entity';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { UserStatusHistoryResponse } from '@common/interfaces/status-history.interface';

import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,

    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,

    private readonly financialAccountService: FinancialAccountsService,
    private readonly amountService: AmountsService,
    private readonly proofOfPaymentService: ProofOfPaymentsService,
  ) {}


async create(
  createTransactionDto: CreateTransactionDto,
  file: FileUploadDTO,
): Promise<TransactionResponseDto> {
  const createdAt = new Date();

  const financialAccounts = await this.financialAccountService.create(
    createTransactionDto.financialAccounts,
  );

    const amount = await this.amountService.create(createTransactionDto.amount);
    const proofOfPayment = await this.proofOfPaymentService.create(file);

  const transaction = this.transactionsRepository.create({
    countryTransaction: createTransactionDto.countryTransaction,
    message: createTransactionDto.message,
    createdAt,
    senderAccount: financialAccounts.sender,
    receiverAccount: financialAccounts.receiver,
    amount,
    proofOfPayment,
  });

  const savedTransaction = await this.transactionsRepository.save(transaction);

  // Transformar entidad a DTO aplicando @Expose y solo incluir propiedades expuestas
  const transactionDto = plainToInstance(TransactionResponseDto, savedTransaction, {
    excludeExtraneousValues: true,
  });

  return transactionDto;
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

  /**
   * Obtener una transacción por ID validando el email
   */
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
        senderAccount: { paymentMethod: true },
        receiverAccount: { paymentMethod: true },
        amount: true,
        proofOfPayment: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.senderAccount?.createdBy !== userEmail) {
      throw new ForbiddenException('Unauthorized access to this transaction');
    }

    return transaction;
  }
}
