import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionGetResponseDto, TransactionResponseDto } from './dto/transaction-response.dto';

import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { UserStatusHistoryResponse } from '@common/interfaces/status-history.interface';
import { AdminStatus } from 'src/enum/admin-status.enum';

import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { MailerService } from '@mailer/mailer.service';

// -----------------------------
// Helper: Mapeo de métodos de pago
// -----------------------------
function mapReceiverPaymentMethod(paymentMethod: any) {
  if (!paymentMethod) return { tipo: 'Desconocido' };

  if (paymentMethod.pixKey) {
    return {
      tipo: 'Pix',
      clave: paymentMethod.pixKey,
      valor: paymentMethod.pixValue,
      cpf: paymentMethod.cpf,
    };
  }

  if (paymentMethod.wallet && paymentMethod.currency && paymentMethod.network) {
    return {
      tipo: 'Cripto',
      moneda: paymentMethod.currency,
      red: paymentMethod.network,
      wallet: paymentMethod.wallet,
    };
  }

  if (paymentMethod.emailAccount && paymentMethod.transferCode) {
    return {
      tipo: 'Banco Virtual',
      moneda: paymentMethod.currency,
      email: paymentMethod.emailAccount,
      codigoTransferencia: paymentMethod.transferCode,
    };
  }

  if (paymentMethod.bankName) {
    return {
      tipo: 'Banco',
      banco: paymentMethod.bankName,
      moneda: paymentMethod.currency,
      claveEnvio: paymentMethod.sendMethodKey,
      cuenta: paymentMethod.sendMethodValue,
      documento: paymentMethod.documentValue,
    };
  }

  return { tipo: 'Desconocido' };
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,

    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,

    private readonly financialAccountService: FinancialAccountsService,
    private readonly amountService: AmountsService,
    private readonly proofOfPaymentService: ProofOfPaymentsService,
    private readonly mailerService: MailerService,
  ) {}

  // --------------------------------------------------------------------
  // 🔹 Helpers internos
  // --------------------------------------------------------------------
  private async safeExecute<T>(
    fn: () => Promise<T>,
    errorMessage: string,
    ExceptionClass: new (msg: string) => HttpException,
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(`${errorMessage}: ${err.message}`, err.stack);
      throw new ExceptionClass(errorMessage);
    }
  }

  private async findTransactionOrThrow(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['senderAccount'],
    });

    if (!transaction) throw new NotFoundException('Transacción no encontrada.');
    if (!transaction.senderAccount)
      throw new NotFoundException('Cuenta del remitente no encontrada.');

    return transaction;
  }

  private validateSenderLastName(senderLastName: string, lastName: string): void {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (normalize(senderLastName) !== normalize(lastName)) {
      throw new UnauthorizedException('Apellido inválido.');
    }
  }

  private async buildStatusHistory(transaction: Transaction): Promise<UserStatusHistoryResponse[]> {
    const statusHistoryEntities = await this.statusLogRepository
      .createQueryBuilder('statusLog')
      .leftJoin('statusLog.transaction', 'transaction')
      .where('statusLog.transaction = :id', { id: transaction.id })
      .orderBy('statusLog.changedAt', 'ASC')
      .getMany();

    const history = statusHistoryEntities.map((log) => ({
      id: log.id,
      status: log.status,
      changedAt: log.changedAt,
      message: log.message,
    }));

    if (!history.length || history[0].status !== AdminStatus.Pending) {
      history.unshift({
        id: '',
        status: AdminStatus.Pending,
        changedAt: transaction.createdAt,
        message: 'Transacción creada',
      });
    }

    return history;
  }

  // --------------------------------------------------------------------
  // 🔹 Creación de transacciones
  // --------------------------------------------------------------------
  async create(
    createTransactionDto: CreateTransactionDto,
    file: FileUploadDTO,
  ): Promise<TransactionResponseDto> {
    if (!file) {
      throw new BadRequestException('El comprobante de pago (archivo) es obligatorio.');
    }

    try {
      const createdAt = new Date();

      const financialAccounts = await this.safeExecute(
        () => this.financialAccountService.create(createTransactionDto.financialAccounts),
        'Error al crear cuentas financieras',
        BadRequestException,
      );

      const amount = await this.safeExecute(
        () => this.amountService.create(createTransactionDto.amount),
        'Error al crear el monto',
        BadRequestException,
      );

      const proofOfPayment = await this.safeExecute(
        () => this.proofOfPaymentService.create(file),
        'Error al subir comprobante de pago',
        BadRequestException,
      );

      const savedTransaction = await this.safeExecute(
        () =>
          this.transactionsRepository.save(
            this.transactionsRepository.create({
              countryTransaction: createTransactionDto.countryTransaction,
              message: createTransactionDto.message,
              createdAt,
              senderAccount: financialAccounts.sender,
              receiverAccount: financialAccounts.receiver,
              amount,
              proofOfPayment,
            }),
          ),
        'Error al guardar la transacción',
        InternalServerErrorException,
      );

      const fullTransaction = await this.safeExecute(
        () =>
          this.transactionsRepository.findOne({
            where: { id: savedTransaction.id },
            relations: [
              'senderAccount',
              'senderAccount.paymentMethod',
              'receiverAccount',
              'receiverAccount.paymentMethod',
              'amount',
              'proofOfPayment',
            ],
          }),
        'Error al recuperar la transacción completa',
        InternalServerErrorException,
      );

      if (!fullTransaction) {
        throw new NotFoundException('La transacción no se encontró después de ser creada.');
      }

      if (fullTransaction.senderAccount?.createdBy) {
        fullTransaction.senderAccount.createdBy = String(
          fullTransaction.senderAccount.createdBy,
        ).trim();
      }

      const senderEmail = fullTransaction.senderAccount?.createdBy;
      if (senderEmail) {
        await this.mailerService.sendReviewPaymentEmail(senderEmail, fullTransaction);
      }

      return plainToInstance(TransactionResponseDto, fullTransaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error inesperado al crear la transacción', error.stack);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Error inesperado al crear la transacción.');
    }
  }

  // --------------------------------------------------------------------
  // 🔹 Consultas públicas
  // --------------------------------------------------------------------
  async getPublicStatusHistory(
    id: string,
    lastName: string,
  ): Promise<{ status: string; message?: string; history: UserStatusHistoryResponse[] }> {
    const transaction = await this.findTransactionOrThrow(id);
    this.validateSenderLastName(transaction.senderAccount?.lastName, lastName);

    const history = await this.buildStatusHistory(transaction);

    if (history.length === 1 && history[0].status === AdminStatus.Pending) {
      return {
        status: transaction.finalStatus,
        message: 'La transacción aún sigue pendiente, no se ha realizado actualización o cambio.',
        history,
      };
    }

    return { status: transaction.finalStatus, history };
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

  // --------------------------------------------------------------------
  // 🔹 Consultas privadas (requieren email o auth)
  // --------------------------------------------------------------------
  async findAllUserEmail(
    createdBy: string,
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: TransactionGetResponseDto[];
    pagination: { page: number; pageSize: number; totalItems: number; totalPages: number };
  }> {
    if (!createdBy?.trim()) {
      throw new ForbiddenException('No se proporcionó un email válido');
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [transactions, totalItems] = await this.transactionsRepository.findAndCount({
      relations: {
        senderAccount: { paymentMethod: true },
        receiverAccount: { paymentMethod: true },
        proofOfPayment: true,
        amount: true,
        regret: true,
      },
      where: { senderAccount: { createdBy } },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    const data = transactions.map((tx) =>
      plainToInstance(TransactionGetResponseDto, {
        id: tx.id,
        createdAt: tx.createdAt.toISOString(),
        finalStatus: tx.finalStatus,
        regretId: tx.regret ? tx.regret.id : null,
        senderAccount: {
          id: tx.senderAccount.id,
          firstName: tx.senderAccount.firstName,
          lastName: tx.senderAccount.lastName,
          createdBy: tx.senderAccount.createdBy,
          phoneNumber: tx.senderAccount.phoneNumber,
          paymentMethod: {
            id: tx.senderAccount.paymentMethod.id,
            platformId: tx.senderAccount.paymentMethod.platformId,
            method: tx.senderAccount.paymentMethod.method,
          },
        },
        receiverAccount: {
          id: tx.receiverAccount.id,
          paymentMethod: mapReceiverPaymentMethod(tx.receiverAccount.paymentMethod),
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
      }),
    );

    return { pagination: { page, pageSize, totalItems, totalPages }, data };
  }

  async getTransactionByEmail(transactionId: string, userEmail: string): Promise<Transaction> {
    if (!userEmail?.trim()) throw new ForbiddenException('El email es obligatorio');

    try {
      const transaction = await this.transactionsRepository.findOne({
        where: { id: transactionId },
        relations: {
          regret: true,
          senderAccount: { paymentMethod: true },
          receiverAccount: { paymentMethod: true },
          amount: true,
          proofOfPayment: true,
        },
      });

      if (!transaction)
        throw new NotFoundException(`No se encontró transacción con id '${transactionId}'`);
      if (transaction.senderAccount?.createdBy !== userEmail) {
        throw new ForbiddenException('Acceso no autorizado a esta transacción');
      }

      return transaction;
    } catch (error) {
      this.logger.error(`Error al obtener transacción ${transactionId}`, error.stack);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error inesperado al obtener la transacción');
    }
  }

  async findOne(id: string, options?: FindOneOptions<Transaction>): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id }, ...options });
    if (!transaction) throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    return transaction;
  }
}
