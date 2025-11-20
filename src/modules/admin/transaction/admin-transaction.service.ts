import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Between, ILike } from 'typeorm';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { StatusHistoryResponse } from 'src/common/interfaces/status-history.interface';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { AdministracionMaster } from '@admin/entities/administracion-master.entity';
import { BankService } from '@financial-accounts/payment-methods/bank/bank.service';
import { User } from '@users/entities/user.entity';
import { Status } from 'src/enum/status.enum';
import { Transaction } from '@transactions/entities/transaction.entity';
import { FileUploadDTO } from 'src/modules/file-upload/dto/file-upload.dto';
import { UpdateBankDto } from '@financial-accounts/payment-methods/bank/dto/create-bank.dto';
import {
  TransactionAdminResponseDto,
  TransactionByIdAdminResponseDto,
} from './dto/get-transaction-response.dto';
import { UpdateStarsService } from './updateStars.service';
// import { TransactionGetResponseDto } from '@transactions/dto/transaction-response.dto';

@Injectable()
export class AdminTransactionService {
  private readonly logger = new Logger(AdminTransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,
    @InjectRepository(AdministracionMaster)
    private readonly adminMasterRepository: Repository<AdministracionMaster>,
    private readonly proofOfPaymentService: ProofOfPaymentsService,
    private readonly bankService: BankService,
    private readonly updateStars: UpdateStarsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProofOfPayment)
    private readonly proofOfPaymentRepository: Repository<ProofOfPayment>,
  ) {}

  private convertStatusToTransactionStatus(status: Status): Status {
    const statusMap: Record<Status, Status> = {
      [Status.Pending]: Status.Pending,
      [Status.ReviewPayment]: Status.ReviewPayment,
      [Status.Approved]: Status.Approved,
      [Status.Rejected]: Status.Rejected,
      [Status.RefundInTransit]: Status.RefundInTransit,
      [Status.InTransit]: Status.InTransit,
      [Status.Discrepancy]: Status.Discrepancy,
      [Status.Cancelled]: Status.Cancelled,
      [Status.Modified]: Status.Modified,
      [Status.Refunded]: Status.Refunded,
      [Status.Completed]: Status.Completed,
    };
    return statusMap[status] || Status.Pending;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FIND ALL                                   */
  /* -------------------------------------------------------------------------- */
  async findAllTransactions(filters: {
    page: number;
    perPage: number;
    country?: string;
    status?: string;
    method?: string;
    search?: string;
  }): Promise<{ meta: any; data: TransactionAdminResponseDto[] }> {
    const { page, perPage, country, status, method, search } = filters;

    const query = this.transactionsRepository
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.senderAccount', 'senderAccount')
      .leftJoinAndSelect('senderAccount.paymentMethod', 'senderPaymentMethod')
      .leftJoinAndSelect('tx.receiverAccount', 'receiverAccount')
      .leftJoinAndSelect('receiverAccount.paymentMethod', 'receiverPaymentMethod')
      .leftJoinAndSelect('tx.amount', 'amount')
      .leftJoinAndSelect('tx.proofsOfPayment', 'proofsOfPayment')
      .leftJoinAndSelect('tx.note', 'note')
      .leftJoinAndSelect('tx.regret', 'regret')
      .orderBy('tx.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    // 📍 Filtros
    if (country) {
      query.andWhere('LOWER(tx.countryTransaction) = LOWER(:country)', { country });
    }
    if (status) query.andWhere('tx.finalStatus = :status', { status });
    if (method) {
      query.andWhere(
        '(senderPaymentMethod.method = :method OR receiverPaymentMethod.method = :method)',
        { method },
      );
    }

    // 🔍 Búsqueda por nombre o apellido del senderAccount
    if (search) {
      const searchPattern = search
        .replace(/a/gi, '[aá]')
        .replace(/e/gi, '[eé]')
        .replace(/i/gi, '[ií]')
        .replace(/o/gi, '[oó]')
        .replace(/u/gi, '[uú]');

      query.andWhere(
        `(senderAccount.first_name ~* :pattern OR senderAccount.last_name ~* :pattern OR CONCAT(senderAccount.first_name, ' ', senderAccount.last_name) ~* :pattern)`,
        { pattern: searchPattern },
      );
    }

    const [transactions, total] = await query.getManyAndCount();

    const data = transactions.map((tx) => ({
      id: tx.id,
      countryTransaction: tx.countryTransaction,
      message: tx.message,
      createdAt: tx.createdAt.toISOString(),
      finalStatus: tx.finalStatus,
      regret: tx.regret && { regretId: tx.regret.id },
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
        paymentMethod: tx.receiverAccount.paymentMethod,
      },
      note: tx.note ? { note_id: tx.note.note_id } : undefined,
      proofsOfPayment:
        tx.proofsOfPayment && tx.proofsOfPayment.length > 0 ? tx.proofsOfPayment : [],
      amount: tx.amount,
      isNoteVerified: tx.isNoteVerified,
      noteVerificationExpiresAt: tx.noteVerificationExpiresAt
        ? tx.noteVerificationExpiresAt.toISOString()
        : '',
    }));

    return {
      meta: {
        totalPages: Math.ceil(total / perPage),
        page,
        perPage,
        totalTransactions: total,
      },
      data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET TRANSACTION BY ID                              */
  /* -------------------------------------------------------------------------- */

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: [
        'senderAccount',
        'senderAccount.paymentMethod',
        'receiverAccount',
        'receiverAccount.paymentMethod',
        'amount',
        'proofsOfPayment',
        'note',
        'regret',
      ],
    });

    if (!transaction) {
      Logger.warn(`Transacción no encontrada con ID: ${id}`);
      throw new NotFoundException('Transacción no encontrada.');
    }

    Logger.log(`Transacción encontrada con ID: ${id}`);
    return transaction; // sin map ni filtrado
  }

  private removeNulls = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return undefined;

    if (Array.isArray(obj)) {
      const cleaned = obj
        .map((v) => this.removeNulls(v))
        .filter((v): v is Exclude<unknown, undefined> => v !== undefined);
      return cleaned;
    }

    if (typeof obj === 'object') {
      const rec = obj as Record<string, unknown>;
      const entries = Object.entries(rec)
        .map(([k, v]) => [k, this.removeNulls(v)] as const)
        .filter(([, v]) => v !== undefined);
      return entries.length ? Object.fromEntries(entries) : undefined;
    }

    return obj;
  };

  formatTransaction(transaction: Transaction): TransactionByIdAdminResponseDto {
    // ⬅️ Corregido el tipo de entrada
    const sender = transaction.senderAccount;
    const receiver = transaction.receiverAccount;

    // Manejo de la nota para evitar errores de 'undefined' y convertir la fecha
    const formattedNote = transaction.note
      ? {
          note_id: transaction.note.note_id,
          attachments: transaction.note.attachments,
          //img_url: transaction.note.img_url,
          message: transaction.note.message,
          // Convertimos la fecha (tipo Date) a string ISO, si existe.
          createdAt: transaction.note.createdAt?.toISOString(),
        }
      : null; // Si no hay nota, el campo es nulo.

    // Construimos el objeto final con todos los campos necesarios.
    return {
      id: transaction.id,
      countryTransaction: transaction.countryTransaction,
      message: transaction.message,
      createdAt: transaction.createdAt.toISOString(),
      finalStatus: transaction.finalStatus,
      regret: transaction.regret,
      senderAccount: this.removeNulls({
        id: sender.id,
        firstName: sender.firstName,
        lastName: sender.lastName,
        createdBy: sender.createdBy,
        phoneNumber: sender.phoneNumber,
        paymentMethod: sender.paymentMethod,
      }),
      receiverAccount: {
        id: receiver.id,
        paymentMethod: receiver.paymentMethod, // Igual que arriba
      },
      note: formattedNote, // Usamos el objeto de nota formateado
      proofsOfPayment:
        transaction.proofsOfPayment && transaction.proofsOfPayment.length > 0
          ? transaction.proofsOfPayment
          : [],
      amount: transaction.amount,
      isNoteVerified: transaction.isNoteVerified,
      noteVerificationExpiresAt: transaction.noteVerificationExpiresAt?.toISOString(),
    } as TransactionByIdAdminResponseDto;
  }

  async getTransactionsByCreatedBy(email: string): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      where: { senderAccount: { createdBy: email } },
      relations: [
        'senderAccount',
        'senderAccount.paymentMethod',
        'receiverAccount',
        'receiverAccount.paymentMethod',
        'amount',
        'proofsOfPayment',
        'note',
        'regret',
      ],
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No se encontraron transacciones con ese email.');
    }

    return transactions;
  }

  /* -------------------------------------------------------------------------- */
  /*                        STATUS HISTORY FOR A TX                              */
  /* -------------------------------------------------------------------------- */
  async getStatusHistory(id: string): Promise<StatusHistoryResponse[]> {
    try {
      const statusHistory = await this.statusLogRepository.find({
        where: { transaction: { transactionId: id } },
        relations: ['changedByAdmin', 'changedByAdmin.profile'],
        select: {
          id: true,
          status: true,
          changedAt: true,
          message: true,
          changedByAdmin: {
            id: true,
            profile: {
              firstName: true,
              lastName: true,
            },
          },
        },
        order: { changedAt: 'DESC' },
      });

      if (!statusHistory || statusHistory.length === 0) {
        this.logger.warn(`No se encontró historial de estados para la transacción ${id}`);
        throw new NotFoundException('No se encontró historial de estados.');
      }

      // Transformar la respuesta para tener el formato deseado
      const formattedHistory: StatusHistoryResponse[] = statusHistory.map((log) => ({
        ...log,
        changedByAdmin: {
          id: log.changedByAdmin.id,
          name: `${log.changedByAdmin.profile.firstName} ${log.changedByAdmin.profile.lastName}`,
        },
      }));

      this.logger.log(`Historial de estados obtenido correctamente para la transacción ${id}`);
      return formattedHistory;
    } catch (error) {
      this.logger.error(
        `Error al obtener el historial de estados para la transacción ${id}:`,
        error,
      );
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                    UPDATE TRANSACTION STATUS BY TYPE                       */
  /* -------------------------------------------------------------------------- */
  async updateTransactionStatusByType(
    transactionId: string,
    status: Status,
    adminUser: User,
    message?: string,
    additionalData?: Record<string, any>,
  ) {
    if (!adminUser.roles?.some(role => ['admin', 'super_admin'].includes(role.code))) {
      throw new UnauthorizedException(
        'Solo los administradores pueden actualizar el estado de las transacciones',
      );
    }

    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
      relations: ['amount', 'senderAccount'],
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    if (transaction.finalStatus === Status.Completed) {
      this.logger.warn(
        `Intento de modificar una transacción completada (ID: ${transaction.id}). Estado solicitado: ${status}`,
      );

      throw new BadRequestException(
        'No se puede cambiar el estado de una transacción que ya fue completada.',
      );
    }

    let adminMaster = await this.adminMasterRepository.findOne({ where: { transactionId } });

    if (!adminMaster) {
      adminMaster = this.adminMasterRepository.create({
        transactionId,
        status,
        adminUserId: adminUser.id,
      });
      await this.adminMasterRepository.save(adminMaster);
    } else {
      await this.adminMasterRepository.update(
        { transactionId },
        { status, adminUserId: adminUser.id },
      );
    }

    const statusLog = this.statusLogRepository.create({
      transaction: adminMaster,
      status,
      message,
      changedByAdminId: adminUser.id,
      additionalData,
    });

    await this.statusLogRepository.save(statusLog);

    const transactionStatus = this.convertStatusToTransactionStatus(status);

    await this.transactionsRepository.update(
      { id: transactionId },
      { finalStatus: transactionStatus },
    );

    const updatedTransaction = await this.transactionsRepository.findOne({
      where: { id: transactionId },
    });

    this.logger.log(
      `Estado de transacción ${transactionId} actualizado a ${status} por admin ${adminUser.id}`,
    );

    if (status === Status.Approved) {
      return {
        message: 'Estado cambiado a approved correctamente. No se asignaron recompensas.',
        status: 200,
        transaction: updatedTransaction,
      };
    }

    if (status === Status.Completed) {
      const {
        cycleCompleted,
        ledger,
        message: starMessage,
      } = await this.updateStars.updateStars(transaction.id);

      this.logger.log(
        `Recompensas actualizadas para usuario ${transaction.senderAccount?.createdBy}: +${ledger.quantity}. Ciclo completado: ${cycleCompleted}`,
      );

      if (starMessage) {
        this.logger.log(`Mensaje de recompensa: ${starMessage}`);
      }

      return {
        message: `Estado cambiado a completed y se asignaron recompensas.${starMessage ? ' ' + starMessage : ''}`,
        status: 200,
        transaction: updatedTransaction,
      };
    }

    return {
      message: 'Estado actualizado correctamente.',
      status: 200,
      transaction: updatedTransaction,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                       ADD TRANSACTION RECEIPT (FILE)                       */
  /* -------------------------------------------------------------------------- */
  /**
   * Agrega un comprobante de pago a una transacción administrativa.
   * Puede recibir archivo (buffer) o comprobante (base64/URL).
   */
  async addTransactionReceipt(
    transactionId: string,
    file?: Express.Multer.File,
    comprobante?: string,
  ) {
    if (!transactionId) {
      throw new Error('Se requiere transactionId en la solicitud');
    }

    let url: string | undefined;
    let proofOfPayment: ProofOfPayment; // ✅ cambia a singular

    if (file && file.buffer) {
      const fileName = `voucher_${transactionId}_${Date.now()}`;
      const dto: FileUploadDTO = {
        buffer: file.buffer,
        fieldName: file.fieldname || 'comprobante',
        mimeType: file.mimetype || 'image/png',
        originalName: file.originalname || fileName,
        size: file.size || file.buffer.length,
      };

      proofOfPayment = await this.proofOfPaymentService.create(dto);
      url = proofOfPayment.imgUrl;
    } else if (comprobante) {
      const fileName = `voucher_${transactionId}_${Date.now()}`;

      if (comprobante.startsWith('http')) {
        // 📎 Si es URL
        proofOfPayment = await this.proofOfPaymentService.create({
          buffer: Buffer.from(''),
          fieldName: 'comprobante',
          mimeType: 'image/png',
          originalName: fileName,
          size: 0,
        });
        url = comprobante;
      } else if (comprobante.startsWith('data:')) {
        // 📎 Si es Base64
        const base64Data = comprobante.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const dto: FileUploadDTO = {
          buffer,
          fieldName: 'comprobante',
          mimeType: 'image/png',
          originalName: fileName,
          size: buffer.length,
        };

        proofOfPayment = await this.proofOfPaymentService.create(dto);
        url = proofOfPayment.imgUrl;
      } else {
        throw new Error(
          'El formato del comprobante no es válido. Debe ser una URL o una imagen en base64.',
        );
      }
    } else {
      throw new Error('Se requiere un archivo o comprobante válido en la solicitud');
    }

    // Asociar comprobante a la transacción
    const tx = await this.transactionsRepository.findOne({ where: { id: transactionId } });
    if (!tx) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    proofOfPayment.transaction = tx;
    await this.proofOfPaymentRepository.save(proofOfPayment);

    return { message: 'Comprobante cargado', url };
  }

  /* -------------------------------------------------------------------------- */
  /*                           FILTER & PAGINATION                              */
  /* -------------------------------------------------------------------------- */
  async findFiltered(options: FindManyOptions<Transaction>) {
    return await this.transactionsRepository.find(options);
  }

  /* -------------------------------------------------------------------------- */
  /*                              PLACEHOLDERS                                  */
  /* -------------------------------------------------------------------------- */
  async updateAdminTransaction(id: string, payload: Partial<Transaction>) {
    // TODO: lógica de actualización
    await this.transactionsRepository.update({ id }, payload);
    return { message: 'Transacción administrativa actualizada' };
  }

  async updateReceiver(id: string, payload: any) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['receiverAccount', 'receiverAccount.paymentMethod'],
    });
    if (!transaction) {
      throw new Error('Transacción no encontrada.');
    }
    const receiver = transaction.receiverAccount;
    if (!receiver) {
      throw new Error('No se encontró receiver asociado a la transacción.');
    }
    // Obtener el banco asociado al receiver
    const paymentMethod = receiver.paymentMethod as { id: string; method?: string } | undefined;
    if (!paymentMethod || paymentMethod.method !== 'bank') {
      throw new Error('No se encontró banco asociado al receiver.');
    }
    const bankId: string = paymentMethod.id;
    // Actualizar el banco usando BankService
    const { bankName, currency, sendMethodKey, sendMethodValue, documentType, documentValue } =
      (payload as Partial<UpdateBankDto>) || {};
    const updateBankDto: UpdateBankDto = {
      ...(bankName ? { bankName } : {}),
      ...(currency ? { currency } : {}),
      ...(sendMethodKey ? { sendMethodKey } : {}),
      ...(sendMethodValue ? { sendMethodValue } : {}),
      ...(documentType ? { documentType } : {}),
      ...(documentValue ? { documentValue } : {}),
    } as UpdateBankDto;
    await this.bankService.update(bankId, updateBankDto);
    // Devolver la transacción actualizada
    const updated = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['receiverAccount', 'receiverAccount.paymentMethod'],
    });
    return updated;
  }

  async updateTransaction(id: string, payload: unknown) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofsOfPayment: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    const p = (payload as Record<string, unknown>) || {};

    if (transaction.finalStatus === Status.Completed) {
      throw new BadRequestException(
        'No se puede modificar una transacción que ya está marcada como completada.',
      );
    }

    const fs = p.finalStatus;
    if (typeof fs === 'string' && Object.values(Status).includes(fs as Status)) {
      if (fs === Status.Completed) {
        throw new BadRequestException(
          'No se puede marcar la transacción como completed desde este endpoint.',
        );
      }
    }

    if (typeof p.message === 'string') {
      transaction.message = p.message;
    }

    if (typeof p.isNoteVerified === 'boolean') {
      transaction.isNoteVerified = p.isNoteVerified;
    }

    const ns = p.noteVerificationExpiresAt;
    if (typeof ns === 'string' || ns instanceof Date) {
      transaction.noteVerificationExpiresAt = ns instanceof Date ? ns : new Date(ns);
    }

    if (typeof fs === 'string' && Object.values(Status).includes(fs as Status)) {
      transaction.finalStatus = fs as Status;
    }

    await this.transactionsRepository.save(transaction);

    const updated = await this.transactionsRepository.findOne({
      where: { id },
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofsOfPayment: true,
      },
    });

    return {
      message: 'Transacción actualizada correctamente.',
      status: 200,
      transaction: updated,
    };
  }

  /**
   * Obtiene todas las transacciones con paginación y filtros dinámicos.
   * @param userEmail Email del usuario (o null si es admin)
   * @param page Página actual (1 por defecto)
   * @param perPage Cantidad por página (6 por defecto)
   * @param filters Filtros dinámicos (status, fechas, etc)
   */
  async findAllTransactionsPaginated(
    userEmail: string | null,
    page = 1,
    perPage = 6,
    filters: Record<string, string | number | boolean | Date> = {},
  ): Promise<{
    meta: {
      totalPages: number;
      page: number;
      perPage: number;
      totalTransactions: number;
    };
    data: Transaction[];
  }> {
    // Construir el query builder
    const qb = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.senderAccount', 'senderAccount')
      .leftJoinAndSelect('transaction.receiverAccount', 'receiverAccount')
      .leftJoinAndSelect('transaction.amount', 'amount')
      .leftJoinAndSelect('transaction.proofsOfPayment', 'proofsOfPayment');

    // Filtro por email (si no es admin)
    if (userEmail) {
      qb.andWhere(
        '(transaction.createdBy = :userEmail OR transaction.senderAccount.email = :userEmail)',
        { userEmail },
      );
    }

    // Filtros dinámicos (status, fechas, etc)
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      // Ejemplo: status, beginTransaction, etc
      if (key === 'status') {
        qb.andWhere('transaction.finalStatus = :status', { status: value as string });
      } else if (key === 'beginTransaction') {
        qb.andWhere('transaction.beginTransaction >= :beginTransaction', {
          beginTransaction: value as Date,
        });
      } else if (key === 'endTransaction') {
        qb.andWhere('transaction.endTransaction <= :endTransaction', {
          endTransaction: value as Date,
        });
      } else {
        // Filtro genérico por campo en transaction
        qb.andWhere(`transaction.${key} = :${key}`, { [key]: value as string | number | boolean });
      }
    });

    // Contar total antes de paginar
    const totalTransactions = await qb.getCount();

    // Paginación
    const validPage = Math.max(1, page);
    const validPerPage = Math.max(1, Math.min(100, perPage));
    qb.skip((validPage - 1) * validPerPage).take(validPerPage);

    // Ordenar por fecha de creación descendente
    qb.orderBy('transaction.createdAt', 'DESC');

    // Ejecutar query
    const data = await qb.getMany();

    return {
      meta: {
        totalPages: Math.ceil(totalTransactions / validPerPage),
        page: validPage,
        perPage: validPerPage,
        totalTransactions,
      },
      data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                           GET ALL STATUS HISTORY                           */
  /* -------------------------------------------------------------------------- */
  async getAllStatusHistory(page = 1, limit = 10) {
    try {
      const [statusHistory, total] = await this.statusLogRepository.findAndCount({
        relations: ['transaction', 'changedByAdmin', 'changedByAdmin.profile'],
        select: {
          id: true,
          status: true,
          changedAt: true,
          message: true,
          changedByAdmin: {
            id: true,
            profile: {
              firstName: true,
              lastName: true,
            },
          },
        },
        order: { changedAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Transformar la respuesta para tener el formato deseado
      const formattedHistory: StatusHistoryResponse[] = statusHistory.map((log) => ({
        ...log,
        changedByAdmin: {
          id: log.changedByAdmin.id,
          name: `${log.changedByAdmin.profile.firstName} ${log.changedByAdmin.profile.lastName}`,
        },
      }));

      return {
        data: formattedHistory,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error al obtener el historial completo de estados:', error);
      throw error;
    }
  }
}
