import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Express } from 'express';

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
  async getTransactionById(id: string): Promise<AdministracionMaster | null> {
    return await this.adminMasterRepository.findOne({
      where: { id },
      relations: {
        administrativo: true,
        transaction: true,
        statusLogs: true,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                        STATUS HISTORY FOR A TX                              */
  /* -------------------------------------------------------------------------- */
  async getStatusHistory(id: string): Promise<AdministracionStatusLog[]> {
    return await this.statusLogRepository.find({
      where: { transaction: { id } },
      order: { changedAt: 'DESC' },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                    UPDATE TRANSACTION STATUS BY TYPE                       */
  /* -------------------------------------------------------------------------- */
  async updateTransactionStatusByType(transactionId: string, status: string) {
    // TODO: Validar status contra enum
    await this.adminMasterRepository.update(
      { id: transactionId },
      { status: status as any },
    );
    return { message: 'Estado actualizado', status };
  }

  /* -------------------------------------------------------------------------- */
  /*                       ADD TRANSACTION RECEIPT (FILE)                       */
  /* -------------------------------------------------------------------------- */
  async addTransactionReceipt(
    transactionId: string,
    file: Express.Multer.File,
  ) {
    const dto: FileUploadDTO = {
      buffer: file.buffer,
      fieldName: file.fieldname,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    };
    const url = await this.fileUploadService.uploadFile(
      dto,
      'SwaplyAr/transactions',
      `${transactionId}_receipt`,
    );
    // Aquí se puede guardar la URL en el registro de administracion_master
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
    // TODO: lógica para actualizar receptor
    return { message: 'Receiver actualizado (pendiente)' };
  }

  async updateTransaction(id: string, payload: any) {
    // TODO: lógica para actualizar transacción
    return { message: 'Transacción actualizada (pendiente)' };
  }
}
