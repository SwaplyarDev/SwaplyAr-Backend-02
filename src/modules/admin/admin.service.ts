import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdministracionMaster)
    private readonly adminMasterRepository: Repository<AdministracionMaster>,
    @InjectRepository(AdministracionStatusLog)
    private readonly statusLogRepository: Repository<AdministracionStatusLog>,
    private readonly fileUploadService: FileUploadService,
  ) {}



  /* -------------------------------------------------------------------------- */
  /*                                 FIND ALL                                   */
  /* -------------------------------------------------------------------------- */
  async findAllTransactions(): Promise<AdministracionMaster[]> {
    return await this.adminMasterRepository.find({
      relations: {
        administrativo: true,
        transaction: true,
        statusLogs: true,
      },
    });
  }



  /* -------------------------------------------------------------------------- */
  /*                         GET TRANSACTION BY ID                              */
  /* -------------------------------------------------------------------------- */
  async getTransactionById(id: string): Promise<AdministracionMaster> {
    const transaction = await this.adminMasterRepository.findOne({
      where: { id },
      relations: {
        administrativo: true,
        transaction: true,
        statusLogs: true,
      },
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
  async getStatusHistory(id: string): Promise<AdministracionStatusLog[]> {
    try {
      const statusHistory = await this.statusLogRepository.find({
        where: { transaction: { id } },
        order: { changedAt: 'DESC' },
      });
      if (!statusHistory || statusHistory.length === 0) {
        Logger.error('No se encontró historial de estados.');
        throw new NotFoundException('No se encontró historial de estados.');
      }
      Logger.log('Historial de estados obtenido correctamente');
      return statusHistory;
    } catch (error) {
      Logger.error('Error al obtener el historial de estados:', error);
      throw error;
    }
  }





  /* -------------------------------------------------------------------------- */
  /*                    UPDATE TRANSACTION STATUS BY TYPE                       */
  /* -------------------------------------------------------------------------- */
  async updateTransactionStatusByType(transactionId: string, status: string, additionalInfo: any = {}) {
    // Validar que la transacción exista
    const transaction = await this.adminMasterRepository.findOne({ where: { id: transactionId } });
    if (!transaction) {
      throw new Error('Transacción no encontrada.');
    }
    // Actualizar el estado
    await this.adminMasterRepository.update(
      { id: transactionId },
      { status: status as any, ...additionalInfo },
    );
    // Leer la transacción actualizada
    const updated = await this.adminMasterRepository.findOne({ where: { id: transactionId } });
    return { message: 'Estado actualizado', status, transaction: updated };
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

    // Si viene archivo
    if (file && file.buffer) {
      const fileName = `voucher_${transactionId}_${Date.now()}`;
      const dto: FileUploadDTO = {
        buffer: file.buffer,
        fieldName: file.fieldname || 'comprobante',
        mimeType: file.mimetype || 'image/png',
        originalName: file.originalname || fileName,
        size: file.size || file.buffer.length,
      };
      url = await this.fileUploadService.uploadFile(
        dto,
        'SwaplyAr/transactions',
        fileName,
      );
    } else if (comprobante) {
      if (comprobante.startsWith('http')) {
        if (comprobante.includes('cloudinary.com')) {
          url = comprobante;
        } else {
          const fileName = `voucher_${transactionId}_${Date.now()}`;
          const buffer = Buffer.from(comprobante);
          const dto: FileUploadDTO = {
            buffer,
            fieldName: 'comprobante',
            mimeType: 'image/png',
            originalName: fileName,
            size: buffer.length,
          };
          url = await this.fileUploadService.uploadFile(
            dto,
            'SwaplyAr/transactions',
            fileName,
          );
        }
      } else if (comprobante.startsWith('data:')) {
        const base64Data = comprobante.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `voucher_${transactionId}_${Date.now()}`;
        const dto: FileUploadDTO = {
          buffer,
          fieldName: 'comprobante',
          mimeType: 'image/png',
          originalName: fileName,
          size: buffer.length,
        };
        url = await this.fileUploadService.uploadFile(
          dto,
          'SwaplyAr/transactions',
          fileName,
        );
      } else {
        throw new Error('El formato del comprobante no es válido. Debe ser una URL o una imagen en base64.');
      }
    } else {
      throw new Error('Se requiere un archivo o comprobante válido en la solicitud');
    }

    // Actualizar la transacción con la URL del comprobante
    await this.adminMasterRepository.update(
      { id: transactionId },
      { transferReceived: url },
    );
    return { message: 'Comprobante cargado', url };
  }




  /* -------------------------------------------------------------------------- */
  /*                           FILTER & PAGINATION                              */
  /* -------------------------------------------------------------------------- */
  async findFiltered(options: FindManyOptions<AdministracionMaster>) {
    return await this.adminMasterRepository.find(options);
  }




  /* -------------------------------------------------------------------------- */
  /*                              PLACEHOLDERS                                  */
  /* -------------------------------------------------------------------------- */
  async updateAdminTransaction(id: string, payload: any) {
    // TODO: lógica de actualización
    await this.adminMasterRepository.update({ id }, payload);
    return { message: 'Transacción administrativa actualizada' };
  }




  async updateReceiver(id: string, payload: any) {
    const { bank_name, sender_method_value, document_value } = payload;
    const transaction = await this.adminMasterRepository.findOne({
      where: { id },
      relations: { transaction: true },
    });
    if (!transaction) {
      throw new Error('Transacción no encontrada.');
    }
    // Solo actualiza los campos enviados
    const receiver = (transaction.transaction as any)?.receiverAccount;
    if (!receiver) {
      throw new Error('No se encontró receiver asociado a la transacción.');
    }
    if (bank_name) receiver.bankName = bank_name;
    if (sender_method_value) receiver.senderMethodValue = sender_method_value;
    if (document_value) receiver.documentValue = document_value;
    // Guardar cambios en receiver
    await (receiver as any).save?.(); // Si receiver es entidad, guardar
    // Devolver la transacción actualizada
    const updated = await this.adminMasterRepository.findOne({
      where: { id },
      relations: { transaction: true },
    });
    return updated;
  }


  

  async updateTransaction(id: string, payload: any) {
    const transaction = await this.adminMasterRepository.findOne({
      where: { id },
      relations: { transaction: true },
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
    await this.adminMasterRepository.save(transaction);
    // Devolver la transacción actualizada
    const updated = await this.adminMasterRepository.findOne({
      where: { id },
      relations: { transaction: true },
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
    filters: Record<string, any> = {}
  ): Promise<{
    meta: {
      totalPages: number;
      page: number;
      perPage: number;
      totalTransactions: number;
    };
    data: AdministracionMaster[];
  }> {
    // Construir el query builder
    const qb = this.adminMasterRepository.createQueryBuilder('admin')
      .leftJoinAndSelect('admin.transaction', 'transaction')
      .leftJoinAndSelect('admin.administrativo', 'administrativo')
      .leftJoinAndSelect('admin.statusLogs', 'statusLogs');

    // Filtro por email (si no es admin)
    if (userEmail) {
      qb.andWhere(
        '(transaction.createdBy = :userEmail OR transaction.senderAccount.email = :userEmail)',
        { userEmail }
      );
    }

    // Filtros dinámicos (status, fechas, etc)
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      // Ejemplo: status, beginTransaction, etc
      if (key === 'status') {
        qb.andWhere('admin.status = :status', { status: value });
      } else if (key === 'beginTransaction') {
        qb.andWhere('admin.beginTransaction >= :beginTransaction', { beginTransaction: value });
      } else if (key === 'endTransaction') {
        qb.andWhere('admin.endTransaction <= :endTransaction', { endTransaction: value });
      } else {
        // Filtro genérico por campo en admin
        qb.andWhere(`admin.${key} = :${key}`, { [key]: value });
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
} 