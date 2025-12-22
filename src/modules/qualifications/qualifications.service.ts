import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qualification } from './entities/qualification.entity';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { Transaction } from '@transactions/entities/transaction.entity';

@Injectable()
export class QualificationService {
  constructor(
    @InjectRepository(Qualification)
    private qualificationRepo: Repository<Qualification>,

    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  // Crea una nueva calificación si no existe una para la misma transacción
  async create(dto: CreateQualificationDto): Promise<Qualification> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: dto.transaction_id },
    });

    if (!transaction) {
      throw new BadRequestException('La transacción no existe');
    }

    const exists = await this.qualificationRepo.findOne({
      where: { transaction: { id: dto.transaction_id } },
    });

    if (exists) {
      throw new BadRequestException('La calificación ya ha sido enviada');
    }

    const qualification = this.qualificationRepo.create({
      stars_amount: dto.stars_amount,
      note: dto.note,
      transaction,
    });

    return this.qualificationRepo.save(qualification);
  }

  // Obtiene todas las calificaciones
  async findAll(): Promise<Qualification[]> {
    return this.qualificationRepo.find();
  }

  // Busca una calificación por ID de transacción
  async findByTransactionId(id: string): Promise<Qualification> {
    const qualification = await this.qualificationRepo.findOne({
      where: { transaction: { id } },
    });

    if (!qualification) {
      throw new NotFoundException('Calificación no encontrada');
    }

    return qualification;
  }
}
