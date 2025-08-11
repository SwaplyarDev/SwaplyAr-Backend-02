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
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { UserStatusHistoryResponse } from '@common/interfaces/status-history.interface';

import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';

import { plainToInstance } from 'class-transformer';
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

  /**
   * Obtener historial público de una transacción validando por apellido
   */
  async getPublicStatusHistory(
    id: string,
    lastName: string,
  ): Promise<UserStatusHistoryResponse[]> {
    console.log(
      `Buscando historial para transaction_id: ${id} y lastName: ${lastName}`,
    );

    try {
      const transaction = await this.transactionsRepository.findOne({
        where: { id },
        relations: ['senderAccount'],
      });

      if (!transaction) {
        console.log('Transacción no encontrada.');
        throw new NotFoundException('Transacción no encontrada.');
      }

      if (!transaction.senderAccount) {
        console.log('Cuenta del remitente no encontrada.');
        throw new NotFoundException('Cuenta del remitente no encontrada.');
      }

      const normalizeString = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      const senderLastNameNormalized = normalizeString(
        transaction.senderAccount.lastName,
      );
      const lastNameNormalized = normalizeString(lastName);

      if (senderLastNameNormalized !== lastNameNormalized) {
        console.log(
          'El apellido no coincide con el del remitente de la transacción.',
        );
        throw new UnauthorizedException('Apellido inválido.');
      }

      const statusHistory = await this.statusLogRepository
        .createQueryBuilder('statusLog')
        .leftJoin('statusLog.transaction', 'transaction')
        .where('transaction.transaction_id = :id', { id })
        .orderBy('statusLog.changedAt', 'DESC')
        .getMany();

      if (!statusHistory.length) {
        console.log(
          'La transacción aún sigue pendiente, no se ha realizado actualización o cambio.',
        );
        throw new NotFoundException(
          'La transacción aún sigue pendiente, no se ha realizado actualización o cambio.',
        );
      }

      return statusHistory.map((log) => ({
        id: log.id,
        status: log.status,
        changedAt: log.changedAt,
        message: log.message,
      }));
    } catch (error) {
      console.error('Error en getPublicStatusHistory:', error);
      throw error;
    }
  }

  /**
   * Crear una nueva transacción con cuentas, monto y comprobante
   */


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

  const transactionDto = plainToInstance(TransactionResponseDto, savedTransaction, {
  excludeExtraneousValues: true,

  }); 

  return transactionDto;
}


  /**
   * Obtener todas las transacciones con relaciones
   */
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
