import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { MailerService } from '@mailer/mailer.service';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { UserStatusHistoryResponse } from '@common/interfaces/status-history.interface';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { plainToInstance } from 'class-transformer';
import {
  TransactionGetResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto';
import { FindOneOptions, Repository } from 'typeorm';

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
    private readonly mailerService: MailerService,
  ) { }

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
        throw new NotFoundException('Transacción no encontrada.');
      }

      if (!transaction.senderAccount) {
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
        throw new UnauthorizedException('Apellido inválido.');
      }

      const statusHistory = await this.statusLogRepository
        .createQueryBuilder('statusLog')
        .leftJoin('statusLog.transaction', 'transaction')
        .where('transaction.transaction_id = :id', { id })
        .orderBy('statusLog.changedAt', 'DESC')
        .getMany();

      if (!statusHistory.length) {
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
    try {
      const createdAt = new Date();

      if (!file) {
        throw new BadRequestException('El comprobante de pago (archivo) es obligatorio.');
      }

      let financialAccounts;
      try {
        financialAccounts = await this.financialAccountService.create(
          createTransactionDto.financialAccounts,
        );

      } catch (err) {
        throw new BadRequestException(`Error al crear cuentas financieras: ${err.message || err}`);
      }

      let amount;
      try {
        amount = await this.amountService.create(createTransactionDto.amount);
      } catch (err) {
        throw new BadRequestException(`Error al crear el monto: ${err.message || err}`);
      }

      let proofOfPayment;
      try {
        proofOfPayment = await this.proofOfPaymentService.create(file);
      } catch (err) {
        throw new BadRequestException(`Error al subir comprobante de pago: ${err.message || err}`);
      }

      let savedTransaction;
      try {
        const transaction = this.transactionsRepository.create({
          countryTransaction: createTransactionDto.countryTransaction,
          message: createTransactionDto.message,
          createdAt, // verifica si en la entidad es createdAt o created_at
          senderAccount: financialAccounts.sender,
          receiverAccount: financialAccounts.receiver,
          amount,
          proofOfPayment,
        });
        console.log('Transacción a guardar:', transaction);
        savedTransaction = await this.transactionsRepository.save(transaction);
      } catch (err) {
        throw new InternalServerErrorException(`Error al guardar la transacción: ${err.message || err}`);
      }
      console.log('Resultado guardado:', savedTransaction);

      let fullTransaction;
      try {
        fullTransaction = await this.transactionsRepository.findOne({
          where: { id: savedTransaction.id },
          relations: [
            'senderAccount',
            'senderAccount.paymentMethod',
            'receiverAccount',
            'receiverAccount.paymentMethod',
            'amount',
            'proofOfPayment',
          ]
        });


        if (!fullTransaction) {
          throw new NotFoundException('La transacción no se encontró después de ser creada.');
        }

        if (fullTransaction.senderAccount?.createdBy) {
          fullTransaction.senderAccount.createdBy = String(fullTransaction.senderAccount.createdBy).trim();
        }


        const senderEmail = fullTransaction.senderAccount?.createdBy;
        if (senderEmail) {
          await this.mailerService.sendReviewPaymentEmail(senderEmail, fullTransaction);
        }


      } catch (err) {
        throw new InternalServerErrorException(`Error al recuperar la transacción completa: ${err.message || err}`);
      }

      return plainToInstance(TransactionResponseDto, fullTransaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error('Error en TransactionsService.create:', error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Error inesperado al crear la transacción.');
    }

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
     * Obtener transacciónes de usuario Autenticado
     */
  async findAllUserEmail(
    createdBy: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: TransactionGetResponseDto[]; pagination: { page: number; pageSize: number; totalItems: number; totalPages: number } }> {

    if (!createdBy || typeof createdBy !== 'string' || createdBy.trim() === '') {
      throw new Error('Email inválido o no proporcionado');
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [transactions, totalItems] = await this.transactionsRepository.findAndCount({
      relations: {
        senderAccount: { paymentMethod: true },
        receiverAccount: { paymentMethod: true },
        proofOfPayment: true,
        amount: true,
      },
      where: { senderAccount: { createdBy } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    if (!transactions || transactions.length === 0) {
      return {
        data: [],
        pagination: { page, pageSize, totalItems, totalPages },
      };
    }

    // Función auxiliar para mostrar método del destinatario
    function getReceiverMethodDisplay(paymentMethod: any) {
      if (!paymentMethod) return { tipo: 'Desconocido' };
      if (paymentMethod.pixKey !== undefined) {
        return {
          tipo: 'Pix',
          clave: paymentMethod.pixKey,
          valor: paymentMethod.pixValue,
          cpf: paymentMethod.cpf,
        };
      } else if (paymentMethod.wallet !== undefined && paymentMethod.currency && paymentMethod.network) {
        return {
          tipo: 'Cripto',
          moneda: paymentMethod.currency,
          red: paymentMethod.network,
          wallet: paymentMethod.wallet,
        };
      } else if (paymentMethod.emailAccount !== undefined && paymentMethod.transferCode !== undefined) {
        return {
          tipo: 'Banco Virtual',
          moneda: paymentMethod.currency,
          email: paymentMethod.emailAccount,
          codigoTransferencia: paymentMethod.transferCode,
        };
      } else if (paymentMethod.bankName !== undefined) {
        return {
          tipo: 'Banco',
          banco: paymentMethod.bankName,
          moneda: paymentMethod.currency,
          claveEnvio: paymentMethod.sendMethodKey,
          cuenta: paymentMethod.sendMethodValue,
          documento: paymentMethod.documentValue,
        };
      } else {
        return { tipo: 'Desconocido' };
      }
    }

    const data = transactions.map(tx => {
      const senderPaymentMethod = {
        id: tx.senderAccount.paymentMethod.id,
        platformId: tx.senderAccount.paymentMethod.platformId,
        method: tx.senderAccount.paymentMethod.method,
      };

      return {
        id: tx.id,
        createdAt: tx.createdAt.toISOString(),
        finalStatus: tx.finalStatus,
        senderAccount: {
          id: tx.senderAccount.id,
          firstName: tx.senderAccount.firstName,
          lastName: tx.senderAccount.lastName,
          createdBy: tx.senderAccount.createdBy,
          phoneNumber: tx.senderAccount.phoneNumber,
          paymentMethod: senderPaymentMethod,
        },
        receiverAccount: {
          id: tx.receiverAccount.id,
          paymentMethod: getReceiverMethodDisplay(tx.receiverAccount.paymentMethod),
        },
        proofOfPayment: tx.proofOfPayment
          ? { id: tx.proofOfPayment.id, imgUrl: tx.proofOfPayment.imgUrl }
          : undefined,
        amount: {
          id: tx.amount.id,
          amountSent: tx.amount.amountSent,
          currencySent: tx.amount.currencySent,
          currencyReceived: tx.amount.currencyReceived,
          amountReceived: tx.amount.amountReceived,
        },
      };
    });

    return {
      pagination: { page, pageSize, totalItems, totalPages },
      data,
    };
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

    try {
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
        throw new NotFoundException(
          `Transaction with id '${transactionId}' not found`,
        );
      }

      if (transaction.senderAccount?.createdBy !== userEmail) {
        throw new ForbiddenException(
          'Unauthorized access to this transaction',
        );
      }

      return transaction;
    } catch (error) {
      // Si es una excepción de Nest la relanzo
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }

      // Si es cualquier otro error inesperado → 500
      throw new InternalServerErrorException(
        'Unexpected error while fetching transaction',
      );
    }
  }


  async findOne(id: string, options?: FindOneOptions<Transaction>): Promise<Transaction> {

    const transaction = await this.transactionsRepository.findOne({

      where: { id },
      ...options,

    });

    if (!transaction) {

      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);

    }

    return transaction;
  }
}
