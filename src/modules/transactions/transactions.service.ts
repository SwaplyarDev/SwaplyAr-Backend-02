import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

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

/**
 * Service: TransactionsService
 * ---------------------------------------
 * Responsable de gestionar el ciclo de vida de las transacciones:
 *  - Creación (cuentas, monto y comprobante de pago)
 *  - Consulta (pública y privada) del historial/estado
 *  - Lectura de transacciones (listado, detalle)
 *
 * Notas de diseño:
 *  - Se utilizan excepciones HTTP específicas para mejorar la trazabilidad de errores.
 *  - Las transformaciones hacia DTOs de respuesta se realizan con `class-transformer`.
 *  - Los métodos documentan claramente precondiciones y postcondiciones.
 */
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
   * Obtiene un historial **público** de cambios de estado para una transacción,
   * validando que el apellido ingresado coincida con el del remitente.
   *
   * @param id        ID de la transacción
   * @param lastName  Apellido provisto por el usuario (no sensible a acentos o mayúsculas)
   * @throws NotFoundException     Si la transacción o su cuenta remitente no existen, o no hay historial aún
   * @throws UnauthorizedException Si el apellido no coincide con el del remitente
   * @returns Lista normalizada de eventos de estado
   */
  async getPublicStatusHistory(
    id: string,
    lastName: string,
  ): Promise<UserStatusHistoryResponse[]> {
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

      // Normaliza acentos y mayúsculas para comparar apellidos
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

      // Consulta del historial: contempla alias posible `transaction.id` o `transaction.transaction_id`
      const statusHistory = await this.statusLogRepository
        .createQueryBuilder('statusLog')
        .leftJoin('statusLog.transaction', 'transaction')
        .where('(transaction.id = :id OR transaction.transaction_id = :id)', { id })
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
      // Repropaga la excepción exacta si ya es HTTP, de lo contrario deja traza y relanza
      if (error instanceof HttpException) throw error;
      // eslint-disable-next-line no-console
      console.error('Error en getPublicStatusHistory:', error);
      throw new InternalServerErrorException('Error al obtener el historial público.');
    }
  }

  /**
   * Crea una nueva transacción incluyendo:
   *  1) Cuentas financieras (remitente y receptor)
   *  2) Monto
   *  3) Comprobante de pago (archivo)
   *
   * Precondiciones:
   *  - `file` (comprobante) es obligatorio.
   *
   * Postcondiciones:
   *  - Devuelve la transacción recién creada con sus relaciones completas mapeadas a `TransactionResponseDto`.
   */
  async create(
    createTransactionDto: CreateTransactionDto,
    file: FileUploadDTO,
  ): Promise<TransactionResponseDto> {
    try {
      const createdAt = new Date();

      // 1) Validación de archivo obligatorio
      if (!file) {
        throw new BadRequestException('El comprobante de pago (archivo) es obligatorio.');
      }

      // 2) Creación de cuentas financieras
      let financialAccounts;
      try {
        financialAccounts = await this.financialAccountService.create(
          createTransactionDto.financialAccounts,
        );
      } catch (err: any) {
        throw new BadRequestException(
          `Error al crear cuentas financieras: ${err?.message || err}`,
        );
      }

      // 3) Creación de monto
      let amount;
      try {
        amount = await this.amountService.create(createTransactionDto.amount);
      } catch (err: any) {
        throw new BadRequestException(`Error al crear el monto: ${err?.message || err}`);
      }

      // 4) Creación de comprobante de pago
      let proofOfPayment;
      try {
        proofOfPayment = await this.proofOfPaymentService.create(file);
      } catch (err: any) {
        throw new BadRequestException(
          `Error al subir comprobante de pago: ${err?.message || err}`,
        );
      }

      // 5) Creación de transacción
      let savedTransaction: Transaction;
      try {
        const transaction = this.transactionsRepository.create({
          countryTransaction: createTransactionDto.countryTransaction,
          message: createTransactionDto.message,
          createdAt,
          senderAccount: financialAccounts.sender,
          receiverAccount: financialAccounts.receiver,
          amount,
          proofOfPayment,
        });

        savedTransaction = await this.transactionsRepository.save(transaction);
      } catch (err: any) {
        throw new InternalServerErrorException(
          `Error al guardar la transacción: ${err?.message || err}`,
        );
      }

      // 6) Recuperar transacción con todas las relaciones
      let fullTransaction: Transaction | null;
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
          ],
        });

        if (!fullTransaction) {
          throw new NotFoundException('La transacción no se encontró después de ser creada.');
        }

        // Normalización defensiva: evitar espacios accidentales en `createdBy`
        if (fullTransaction.senderAccount?.createdBy) {
          fullTransaction.senderAccount.createdBy = String(
            fullTransaction.senderAccount.createdBy,
          ).trim();
        }
      } catch (err: any) {
        throw new InternalServerErrorException(
          `Error al recuperar la transacción completa: ${err?.message || err}`,
        );
      }

      // 7) Transformar a DTO de respuesta (excluye propiedades no expuestas)
      return plainToInstance(TransactionResponseDto, fullTransaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Captura final para cualquier error no manejado
      // eslint-disable-next-line no-console
      console.error('Error en TransactionsService.create:', error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Error inesperado al crear la transacción.');
    }
  }

  /**
   * Listado de transacciones con sus relaciones principales.
   */
  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      relations: {
        senderAccount: true,
        receiverAccount: true,
        amount: true,
        proofOfPayment: true,
      },
    });
  }

  /**
   * Obtiene una transacción **propiedad del usuario** (validando por email del creador en la cuenta remitente).
   *
   * @param transactionId  ID de la transacción
   * @param userEmail      Email que debe coincidir con `senderAccount.createdBy`
   * @throws ForbiddenException   Si no se envía email o si no coincide
   * @throws NotFoundException    Si la transacción no existe
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

  /**
   * Obtiene una transacción por ID con opciones adicionales.
   * Útil para reusar relaciones/paginación/selecciones sin duplicar lógica.
   *
   * @param id       ID de la transacción
   * @param options  Opciones adicionales de búsqueda de TypeORM
   */
  async findOne(
    id: string,
    options?: FindOneOptions<Transaction>,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      ...(options || {}),
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }
}
