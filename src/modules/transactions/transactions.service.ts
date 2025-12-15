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
import {
  TransactionGetByIdDto,
  TransactionGetResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { UserStatusHistoryResponse } from '@common/interfaces/status-history.interface';
import { Status } from 'src/enum/status.enum';

import { FinancialAccountsService } from '../payments/financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from 'src/modules/payments/proof-of-payments/proof-of-payments.service';
import { MailerService } from '@mailer/mailer.service';
import { ProofOfPayment } from 'src/modules/payments/proof-of-payments/entities/proof-of-payment.entity';
import { UserDiscount } from '../discounts/entities/user-discount.entity';
import { validateMaxFiles } from 'src/common/utils/file-validation.util';
import { SenderFinancialAccountResponseDto } from '../payments/sender-accounts/dto/sender-financial-account-response.dto';
import { FinancialAccountResponseDto } from '../payments/financial-accounts/dto/financial-accounts-response.dto';
import { FinancialAccounts } from '../payments/financial-accounts/entities/financial-accounts.entity';
import { SenderFinancialAccountsService } from '../payments/sender-accounts/sender-financial-accounts.service';
import { TransactionUserDiscounts } from './entities/transaction-user-discounts.entity';

// -----------------------------
// Helper: Mapeo de métodos de pago
// -----------------------------
function mapReceiverPaymentMethod(paymentMethod: unknown) {
  if (!paymentMethod || typeof paymentMethod !== 'object') return { tipo: 'Desconocido' };
  const pm = paymentMethod as Record<string, unknown>;

  if (typeof pm['pixKey'] === 'string') {
    return {
      tipo: 'Pix',
      clave: pm['pixKey'],
      valor: typeof pm['pixValue'] === 'string' ? pm['pixValue'] : undefined,
      cpf: typeof pm['cpf'] === 'string' ? pm['cpf'] : undefined,
    };
  }

  if (
    typeof pm['wallet'] === 'string' &&
    typeof pm['currency'] === 'string' &&
    typeof pm['network'] === 'string'
  ) {
    return {
      tipo: 'Cripto',
      moneda: pm['currency'],
      red: pm['network'],
      wallet: pm['wallet'],
    };
  }

  if (typeof pm['emailAccount'] === 'string' && typeof pm['transferCode'] === 'string') {
    return {
      tipo: 'Banco Virtual',
      moneda: typeof pm['currency'] === 'string' ? pm['currency'] : undefined,
      email: pm['emailAccount'],
      codigoTransferencia: pm['transferCode'],
    };
  }

  if (typeof pm['bankName'] === 'string') {
    return {
      tipo: 'Banco',
      banco: pm['bankName'],
      moneda: typeof pm['currency'] === 'string' ? pm['currency'] : undefined,
      claveEnvio: typeof pm['sendMethodKey'] === 'string' ? pm['sendMethodKey'] : undefined,
      cuenta: typeof pm['sendMethodValue'] === 'string' ? pm['sendMethodValue'] : undefined,
      documento: typeof pm['documentValue'] === 'string' ? pm['documentValue'] : undefined,
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

    @InjectRepository(UserDiscount) // <--- Agregado
    private readonly userDiscountRepository: Repository<UserDiscount>,

    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,

    // Repositorio del lado dueño de la relación (ManyToOne)
    @InjectRepository(ProofOfPayment)
    private readonly proofOfPaymentRepository: Repository<ProofOfPayment>,

    @InjectRepository(TransactionUserDiscounts)
    private readonly transactionUserDiscountsRepository: Repository<TransactionUserDiscounts>,

    private readonly financialAccountService: FinancialAccountsService,
    private readonly senderFinancialAccountService: SenderFinancialAccountsService,
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
      const isError = err instanceof Error;
      const msg = isError && err.message ? `: ${err.message}` : '';
      this.logger.error(`${errorMessage}${msg}`, isError ? err.stack : undefined);
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

    if (!history.length || history[0].status !== Status.Pending) {
      history.unshift({
        id: '',
        status: Status.Pending,
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
    files: FileUploadDTO[],
  ): Promise<TransactionResponseDto> {
    try {
      // Validar cantidad y tamaño de archivos con una función reutilizable
      validateMaxFiles(files, 5, 3); // máx 5 archivos y 3MB de tamaño cada uno
      const createdAt = new Date();

      const financialAccounts = await this.safeExecute<FinancialAccounts>(
        () =>
          this.financialAccountService.create(
            createTransactionDto.financialAccounts,
            createTransactionDto.financialAccounts.userId,
          ),
        'Error al crear cuentas financieras',
        BadRequestException,
      );

      const senderAccount = await this.safeExecute(
        () => this.senderFinancialAccountService.create(createTransactionDto.senderAccount),
        'Error al crear cuenta de remitente',
        BadRequestException,
      );

      const amount = await this.safeExecute(
        () => this.amountService.create(createTransactionDto.amount),
        'Error al crear el monto',
        BadRequestException,
      );

      const userDiscounts: UserDiscount[] = [];

      if (createTransactionDto.userDiscountIds && createTransactionDto.userDiscountIds.length > 0) {
        for (const id of createTransactionDto.userDiscountIds) {
          const ud = await this.safeExecute(
            async () => {
              const discount = await this.userDiscountRepository.findOne({
                where: { id },
                relations: ['discountCode'],
              });

              if (!discount) throw new NotFoundException(`UserDiscount con ID ${id} no encontrado`);
              if (discount.isUsed) throw new BadRequestException(`El cupón ${id} ya fue usado`);
              return discount;
            },

            'Error al validar el descuento',
            BadRequestException,
          );

          ud.isUsed = true;
          ud.usedAt = new Date();
          await this.userDiscountRepository.save(ud);
          userDiscounts.push(ud);
        }
      }

      // 🔹 Subir múltiples comprobantes de pago
      const proofsOfPayment: ProofOfPayment[] = [];

      for (const file of files) {
        const proof = await this.safeExecute(
          () => this.proofOfPaymentService.create(file),
          'Error al subir comprobante de pago',
          BadRequestException,
        );
        proofsOfPayment.push(proof);
      }

      const transactionUserDiscounts: TransactionUserDiscounts[] = [];

      for (const ud of userDiscounts) {
        transactionUserDiscounts.push(
          this.transactionUserDiscountsRepository.create({
            userDiscount: ud,
          }),
        );
      }

      // 1) Guardar transacción (sin intentar setear OneToMany)
      const txEntity = this.transactionsRepository.create({
        countryTransaction: createTransactionDto.countryTransaction,
        message: createTransactionDto.message,
        createdAt,
        financialAccounts: financialAccounts,
        senderAccount: senderAccount,
        amount,
        amountValue: String(amount.amountSent),
        amountCurrency: amount.currencySent,
        transactionUserDiscounts,
      });

      // 2) Guardar transacción principal
      const savedTransaction = await this.safeExecute(
        () => this.transactionsRepository.save(txEntity),
        'Error al guardar la transacción',
        InternalServerErrorException,
      );

      // 3) Asociar los comprobantes a la transacción
      for (const proof of proofsOfPayment) {
        proof.transaction = savedTransaction;
        await this.safeExecute(
          () => this.proofOfPaymentRepository.save(proof),
          'Error al asociar comprobante a la transacción',
          InternalServerErrorException,
        );
      }

      const fullTransaction = await this.safeExecute(
        () =>
          this.transactionsRepository.findOne({
            where: { id: savedTransaction.id },
            relations: [
              'senderAccount',
              'senderAccount.paymentProvider',
              'amount',
              'proofsOfPayment',
              'transactionUserDiscounts',
            ],
          }),
        'Error al recuperar la transacción completa',
        InternalServerErrorException,
      );

      if (!fullTransaction) {
        throw new NotFoundException('La transacción no se encontró después de ser creada.');
      }

      console.log('fullTransaction.userDiscounts:', fullTransaction.transactionUserDiscounts);

      const userDiscountIds =
        fullTransaction.transactionUserDiscounts?.map((ud) => ud.userDiscount.id) ?? [];

      if (fullTransaction.senderAccount?.user.email) {
        fullTransaction.senderAccount.user.email = String(
          fullTransaction.senderAccount.user.email,
        ).trim();
      }

      const senderEmail = fullTransaction.senderAccount?.user.email;
      if (senderEmail) {
        await this.mailerService.sendReviewPaymentEmail(senderEmail, fullTransaction);
      }

      console.log('userDiscountIds:', userDiscountIds);
      return plainToInstance(
        TransactionResponseDto,
        {
          ...fullTransaction,
          financialAccounts: {
            senderAccount: plainToInstance(
              SenderFinancialAccountResponseDto,
              fullTransaction.senderAccount,
              {
                excludeExtraneousValues: true,
              },
            ),
          },
          userDiscounts: fullTransaction.transactionUserDiscounts,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error) {
      this.logger.error(
        'Error inesperado al crear la transacción',
        error instanceof Error ? error.stack : undefined,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error inesperado al crear la transacción.');
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

    if (history.length === 1 && history[0].status === Status.Pending) {
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
        amount: true,
        proofsOfPayment: true,
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
        senderAccount: { paymentProvider: true },
        proofsOfPayment: true,
        amount: true, // Nota: se puede eliminar más adelante y usar amountValue/amountCurrency
        regret: true,
      },
      where: { senderAccount: { user: { email: createdBy } } },
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
          id: tx.senderAccount.senderAccountId,
          firstName: tx.senderAccount.firstName,
          lastName: tx.senderAccount.lastName,
          createdBy: tx.senderAccount.user.email,
          phoneNumber: tx.senderAccount.phoneNumber,
          paymentProvider: {
            id: tx.senderAccount.paymentProvider.paymentProviderId,
            platformId: tx.senderAccount.paymentProvider.paymentPlatform.paymentPlatformId,
          },
        },
        proofsOfPayment:
          tx.proofsOfPayment && tx.proofsOfPayment.length > 0
            ? tx.proofsOfPayment.map((proof) => ({
                id: proof.id,
                imgUrl: proof.imgUrl,
                createdAt: proof.createdAt?.toISOString?.() ?? proof.createdAt,
              }))
            : [],

        proofOfPaymentUrls: tx.proofsOfPayment?.map((proof) => proof.imgUrl) ?? [],

        amount: {
          id: tx.amount.id,
          amountSent: tx.amount.amountSent,
          currencySent: tx.amount.currencySent,
          currencyReceived: tx.amount.currencyReceived,
          amountReceived: tx.amount.amountReceived,
        },
        // Alternativa futura sin join:
        // amountSummary: { value: tx.amountValue, currency: tx.amountCurrency }
      }),
    );

    return { pagination: { page, pageSize, totalItems, totalPages }, data };
  }

  async getTransactionByEmail(
    transactionId: string,
    userEmail: string,
  ): Promise<TransactionGetByIdDto> {
    if (!userEmail?.trim()) throw new ForbiddenException('El email es obligatorio');

    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
      relations: {
        regret: true,
        senderAccount: { paymentProvider: true, user: true },
        amount: true,
        proofsOfPayment: true,
        transactionUserDiscounts: {
          userDiscount: { discountCode: true },
        },
      },
    });

    if (!transaction)
      throw new NotFoundException(`No se encontró transacción con id '${transactionId}'`);
    if (transaction.senderAccount?.user.email !== userEmail)
      throw new ForbiddenException('Acceso no autorizado');

    const financialAccounts = plainToInstance(
      FinancialAccountResponseDto,
      transaction.financialAccounts,
      {
        excludeExtraneousValues: true,
      },
    );

    const senderAccount = plainToInstance(
      SenderFinancialAccountResponseDto,
      transaction.senderAccount,
      {
        excludeExtraneousValues: true,
      },
    );

    const dto = plainToInstance(
      TransactionGetByIdDto,
      {
        ...transaction,
        financialAccounts,
        senderAccount,
      },
      { excludeExtraneousValues: true },
    );

    const discounts = transaction.transactionUserDiscounts ?? [];

    dto.userDiscounts = discounts.map((ud) => ({
      id: ud.userDiscount?.id,
      value: ud.userDiscount?.discountCode?.value ?? null,
      code: ud.userDiscount?.discountCode?.code ?? null,
      usedAt: ud.userDiscount?.usedAt ?? null,
    }));

    return dto;
  }
  async findOne(id: string, options?: FindOneOptions<Transaction>): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id }, ...options });
    if (!transaction) throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    return transaction;
  }
}
