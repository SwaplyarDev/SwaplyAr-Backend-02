import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Transaction } from '../../modules/transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { BankService } from '../financial-accounts/payment-methods/bank/bank.service';
import { UpdateBankDto } from '../financial-accounts/payment-methods/bank/dto/create-bank.dto';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { AdminStatus } from '../../enum/admin-status.enum';
import { User } from '@users/entities/user.entity';
import { TransactionStatus } from '../../enum/trasanction-status.enum';
import { StatusHistoryResponse } from 'src/common/interfaces/status-history.interface';
import { DiscountService } from '@discounts/discounts.service';
import { UpdateStarDto } from '@discounts/dto/update-star.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,
    @InjectRepository(AdministracionMaster)
    private readonly adminMasterRepository: Repository<AdministracionMaster>,
    private readonly fileUploadService: FileUploadService,
    private readonly proofOfPaymentService: ProofOfPaymentsService,
    private readonly bankService: BankService,
    private readonly discountService: DiscountService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private convertAdminStatusToTransactionStatus(
    status: AdminStatus,
  ): TransactionStatus {
    // Mapeo directo entre AdminStatus y TransactionStatus
    const statusMap: Record<AdminStatus, TransactionStatus> = {
      [AdminStatus.Pending]: TransactionStatus.Pending,
      [AdminStatus.ReviewPayment]: TransactionStatus.Review_Payment,
      [AdminStatus.Approved]: TransactionStatus.Approved,
      [AdminStatus.Rejected]: TransactionStatus.Rejected,
      [AdminStatus.RefundInTransit]: TransactionStatus.Refund_In_Transit,
      [AdminStatus.InTransit]: TransactionStatus.In_Transit,
      [AdminStatus.Discrepancy]: TransactionStatus.Discrepancy,
      [AdminStatus.Canceled]: TransactionStatus.Canceled,
      [AdminStatus.Modified]: TransactionStatus.Modified,
      [AdminStatus.Refunded]: TransactionStatus.Refunded,
      [AdminStatus.Completed]: TransactionStatus.Completed,
    };

    return statusMap[status] || TransactionStatus.Pending;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FIND ALL                                   */
  /* -------------------------------------------------------------------------- */
  async findAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsRepository.find({
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofOfPayment: true,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET TRANSACTION BY ID                              */
  /* -------------------------------------------------------------------------- */
  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: [
        'senderAccount',
        'receiverAccount',
        'receiverAccount.paymentMethod',
        'amount',
        'proofOfPayment',
      ],
    });
    if (!transaction) {
      Logger.warn(`Transacción no encontrada con ID: ${id}`);
      throw new NotFoundException('Transacción no encontrada.');
    }
    Logger.log(`Transacción encontrada con ID: ${id}`);
    return transaction;
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
        this.logger.warn(
          `No se encontró historial de estados para la transacción ${id}`,
        );
        throw new NotFoundException('No se encontró historial de estados.');
      }

      // Transformar la respuesta para tener el formato deseado
      const formattedHistory: StatusHistoryResponse[] = statusHistory.map(
        (log) => ({
          ...log,
          changedByAdmin: {
            id: log.changedByAdmin.id,
            name: `${log.changedByAdmin.profile.firstName} ${log.changedByAdmin.profile.lastName}`,
          },
        }),
      );

      this.logger.log(
        `Historial de estados obtenido correctamente para la transacción ${id}`,
      );
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
    status: AdminStatus,
    adminUser: User,
    message?: string,
    additionalData?: Record<string, any>,
  ) {
    // Verificar que el usuario sea admin o super_admin
    if (!['admin', 'super_admin'].includes(adminUser.role)) {
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

    // Buscar o crear el registro en administracion_master
    let adminMaster = await this.adminMasterRepository.findOne({
      where: { transactionId },
    });

    if (!adminMaster) {
      adminMaster = this.adminMasterRepository.create({
        transactionId,
        status,
        adminUserId: adminUser.id,
      });
      await this.adminMasterRepository.save(adminMaster);
    } else {
      // Actualizar el estado en administracion_master
      await this.adminMasterRepository.update(
        { transactionId },
        {
          status,
          adminUserId: adminUser.id,
        },
      );
    }

    // Crear nuevo registro en el historial
    const statusLog = this.statusLogRepository.create({
      transaction: adminMaster,
      status,
      message,
      changedByAdminId: adminUser.id,
      additionalData,
    });

    await this.statusLogRepository.save(statusLog);

    // Convertir el estado de admin a estado de transacción
    const transactionStatus =
      this.convertAdminStatusToTransactionStatus(status);

    // Actualizar el estado en la transacción
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

    if (status === AdminStatus.Approved) {
      // Solo cambia el estado, no asigna recompensas
      return {
        message: 'Estado cambiado a approved correctamente. No se asignaron recompensas.',
        status: 200,
        transaction: updatedTransaction,
      };
    }

    if (status === AdminStatus.Completed) {
      console.log(transaction);
      const quantityToAdd = Number(transaction.amount.amountSent);

      const starDto: UpdateStarDto = {
        quantity: quantityToAdd,
        transactionId: transaction.id,
      };

      const user = await this.userRepository.findOne({
        where: { profile: { email: transaction.senderAccount.createdBy } },
        relations: ['profile'],
      });

      if (user) {
        const userId = user.id;
        const { cycleCompleted, message: starMessage } =
          await this.discountService.updateStars(starDto, userId);

        this.logger.log(
          `Recompensas actualizadas para usuario ${userId}: +${quantityToAdd}. Ciclo completo: ${cycleCompleted}`,
        );

        if (starMessage) {
          this.logger.log(`Mensaje de recompensa: ${starMessage}`);
        }
      } else {
        // Opcional: loggear que no se encontró usuario pero continuar sin error
        this.logger.warn(
          `No se encontró usuario para la transacción ${transactionId}. No se actualizaron estrellas.`,
        );
      }
      return {
        message: 'Estado cambiado a completed y se asignaron recompensas.',
        status: 200,
        transaction: updatedTransaction,
      };
    }

    if (updatedTransaction) {
      delete (updatedTransaction as any).userId; // Eliminar userId manualmente
    }

    return {
      message: 'Estado actualizado',
      status,
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
    let proofOfPayment: any = undefined;
    if (file && file.buffer) {
      const fileName = `voucher_${transactionId}_${Date.now()}`;
      const dto: FileUploadDTO = {
        buffer: file.buffer,
        fieldName: file.fieldname || 'comprobante',
        mimeType: file.mimetype || 'image/png',
        originalName: file.originalname || fileName,
        size: file.size || file.buffer.length,
      };
      // Crear ProofOfPayment y asociar
      proofOfPayment = await this.proofOfPaymentService.create(dto);
      url = proofOfPayment.imgUrl;
    } else if (comprobante) {
      let buffer: Buffer;
      const fileName = `voucher_${transactionId}_${Date.now()}`;
      if (comprobante.startsWith('http')) {
        url = comprobante;
        // Crear ProofOfPayment solo con la URL
        proofOfPayment = await this.proofOfPaymentService.create({
          buffer: Buffer.from(''),
          fieldName: 'comprobante',
          mimeType: 'image/png',
          originalName: fileName,
          size: 0,
        });
      } else if (comprobante.startsWith('data:')) {
        const base64Data = comprobante.split(',')[1];
        buffer = Buffer.from(base64Data, 'base64');
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
      throw new Error(
        'Se requiere un archivo o comprobante válido en la solicitud',
      );
    }
    await this.transactionsRepository.update(
      { id: transactionId },
      { proofOfPayment: proofOfPayment },
    );
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
  async updateAdminTransaction(id: string, payload: any) {
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
    const receiver = transaction.receiverAccount as any;
    if (!receiver) {
      throw new Error('No se encontró receiver asociado a la transacción.');
    }
    // Obtener el banco asociado al receiver
    const paymentMethod = receiver.paymentMethod;
    if (!paymentMethod || paymentMethod.method !== 'bank') {
      throw new Error('No se encontró banco asociado al receiver.');
    }
    const bank = paymentMethod;
    // Actualizar el banco usando BankService
    const updateBankDto: UpdateBankDto = { ...payload };
    await this.bankService.update(bank.id, updateBankDto);
    // Devolver la transacción actualizada
    const updated = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['receiverAccount', 'receiverAccount.paymentMethod'],
    });
    return updated;
  }

  async updateTransaction(id: string, payload: any) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofOfPayment: true,
      },
    });
    if (!transaction) {
      throw new Error('Transacción no encontrada.');
    }
    // Actualizar solo los campos enviados
    Object.keys(payload).forEach((key) => {
      if (key in transaction) {
        transaction[key] = payload[key];
      }
    });
    await this.transactionsRepository.save(transaction);
    // Devolver la transacción actualizada
    const updated = await this.transactionsRepository.findOne({
      where: { id },
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofOfPayment: true,
      },
    });
    return updated;
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
    filters: Record<string, any> = {},
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
      .leftJoinAndSelect('transaction.proofOfPayment', 'proofOfPayment');

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
        qb.andWhere('transaction.finalStatus = :status', { status: value });
      } else if (key === 'beginTransaction') {
        qb.andWhere('transaction.beginTransaction >= :beginTransaction', {
          beginTransaction: value,
        });
      } else if (key === 'endTransaction') {
        qb.andWhere('transaction.endTransaction <= :endTransaction', {
          endTransaction: value,
        });
      } else {
        // Filtro genérico por campo en transaction
        qb.andWhere(`transaction.${key} = :${key}`, { [key]: value });
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
      const [statusHistory, total] =
        await this.statusLogRepository.findAndCount({
          relations: [
            'transaction',
            'changedByAdmin',
            'changedByAdmin.profile',
          ],
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
      const formattedHistory: StatusHistoryResponse[] = statusHistory.map(
        (log) => ({
          ...log,
          changedByAdmin: {
            id: log.changedByAdmin.id,
            name: `${log.changedByAdmin.profile.firstName} ${log.changedByAdmin.profile.lastName}`,
          },
        }),
      );

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
      this.logger.error(
        'Error al obtener el historial completo de estados:',
        error,
      );
      throw error;
    }
  }
}
