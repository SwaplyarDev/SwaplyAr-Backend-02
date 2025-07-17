import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qualification } from './entities/qualification.entity';
import { CreateQualificationDto } from './dto/create-qualification.dto';

@Injectable()
export class QualificationService {
  constructor(
    @InjectRepository(Qualification)
    private qualificationRepo: Repository<Qualification>,
  ) {}

  async create(dto: CreateQualificationDto): Promise<Qualification> {
    const exists = await this.qualificationRepo.findOne({
      where: { transaction_id: dto.transaction_id },
    });

    if (exists) {
      throw new BadRequestException('La calificación ya ha sido enviada');
    }

    const qualification = this.qualificationRepo.create(dto);
    return this.qualificationRepo.save(qualification);
  }

  async findAll(): Promise<Qualification[]> {
    return this.qualificationRepo.find();
  }

  async findByTransactionId(id: string): Promise<Qualification> {
    const qualification = await this.qualificationRepo.findOne({
      where: { transaction_id: id },
    });

    if (!qualification) {
      throw new NotFoundException('Calificación no encontrada');
    }

    return qualification;
  }
}
