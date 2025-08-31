import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbandonedTransaction } from '../entities/abandoned-transaction.entity';
import { CreateAbandonedTransactionDto } from '../dto/create-abandoned-transaction.dto';

@Injectable()
export class AbandonedTransactionsService {
  private readonly logger = new Logger(AbandonedTransactionsService.name);

  constructor(
    @InjectRepository(AbandonedTransaction)
    private readonly abandonedTransactionRepository: Repository<AbandonedTransaction>,
  ) {}

  async create(
    createAbandonedTransactionDto: CreateAbandonedTransactionDto,
  ): Promise<AbandonedTransaction> {
    try {
      if (
        !createAbandonedTransactionDto.email ||
        !createAbandonedTransactionDto.phone_number ||
        !createAbandonedTransactionDto.first_name ||
        !createAbandonedTransactionDto.last_name
      ) {
        this.logger.error('Datos incompletos en la creación de transacción abandonada');
        throw new BadRequestException('Todos los campos son requeridos');
      }

      const abandonedTransaction = this.abandonedTransactionRepository.create(
        createAbandonedTransactionDto,
      );
      const savedTransaction = await this.abandonedTransactionRepository.save(abandonedTransaction);

      this.logger.log(
        `Transacción abandonada creada con ID: ${savedTransaction.abandoned_transaction_id}`,
      );
      return savedTransaction;
    } catch (err) {
      this.logger.error('Error al crear transacción abandonada:', err);
      throw err;
    }
  }

  async findAll(): Promise<AbandonedTransaction[]> {
    try {
      const transactions = await this.abandonedTransactionRepository.find();
      if (!transactions || transactions.length === 0) {
        this.logger.warn('No se encontraron transacciones abandonadas');
        return [];
      }

      this.logger.log(`Se encontraron ${transactions.length} transacciones abandonadas`);
      return transactions;
    } catch (err) {
      this.logger.error('Error al buscar todas las transacciones abandonadas:', err);
      throw err;
    }
  }

  async findOne(id: string): Promise<AbandonedTransaction> {
    try {
      const abandonedTransaction = await this.abandonedTransactionRepository.findOne({
        where: { abandoned_transaction_id: id },
      });

      if (!abandonedTransaction) {
        this.logger.warn(`Transacción abandonada no encontrada con ID: ${id}`);
        throw new NotFoundException(`Transacción abandonada con ID ${id} no encontrada`);
      }

      this.logger.log(`Transacción abandonada encontrada con ID: ${id}`);
      return abandonedTransaction;
    } catch (err) {
      this.logger.error(`Error al buscar transacción abandonada con ID ${id}:`, err);
      throw err;
    }
  }

  async update(
    id: string,
    updateData: Partial<CreateAbandonedTransactionDto>,
  ): Promise<AbandonedTransaction> {
    try {
      const abandonedTransaction = await this.findOne(id);

      Object.assign(abandonedTransaction, updateData);

      const updatedTransaction =
        await this.abandonedTransactionRepository.save(abandonedTransaction);
      this.logger.log(`Transacción abandonada actualizada con ID: ${id}`);
      return updatedTransaction;
    } catch (err) {
      this.logger.error(`Error al actualizar transacción abandonada con ID ${id}:`, err);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.abandonedTransactionRepository.delete(id);

      if (result.affected === 0) {
        this.logger.warn(`Transacción abandonada no encontrada para eliminar con ID: ${id}`);
        throw new NotFoundException(`Transacción abandonada con ID ${id} no encontrada`);
      }

      this.logger.log(`Transacción abandonada eliminada con ID: ${id}`);
    } catch (err) {
      this.logger.error(`Error al eliminar transacción abandonada con ID ${id}:`, err);
      throw err;
    }
  }
}
