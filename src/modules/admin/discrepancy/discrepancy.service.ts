import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscrepancyEntity } from '../entities/discrepancy/discrepancy.entity';
import { CreateDiscrepancyDto } from '../dto/discrepancy/create-discrepancy.dto';
import { UpdateDiscrepancyDto } from '../dto/discrepancy/update-discrepancy.dto';

@Injectable()
export class DiscrepancyService {
  constructor(
    @InjectRepository(DiscrepancyEntity)
    private readonly discrepancyRepository: Repository<DiscrepancyEntity>,
  ) {}

  async create(dto: CreateDiscrepancyDto): Promise<DiscrepancyEntity> {
    const entity = this.discrepancyRepository.create(dto);
    return this.discrepancyRepository.save(entity);
  }

  async findAll(): Promise<DiscrepancyEntity[]> {
    return this.discrepancyRepository.find();
  }

  async findOne(id: number): Promise<DiscrepancyEntity> {
    return this.discrepancyRepository.findOneBy({ discrepancyId: id });
  }

  async update(id: number, dto: UpdateDiscrepancyDto): Promise<DiscrepancyEntity> {
    await this.discrepancyRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.discrepancyRepository.delete(id);
  }
} 