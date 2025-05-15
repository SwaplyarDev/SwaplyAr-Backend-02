import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancelledEntity } from '../entities/cancelled/cancelled.entity';
import { CreateCancelledDto } from '../dto/cancelled/create-cancelled.dto';
import { UpdateCancelledDto } from '../dto/cancelled/update-cancelled.dto';

@Injectable()
export class CancelledService {
  constructor(
    @InjectRepository(CancelledEntity)
    private readonly cancelledRepository: Repository<CancelledEntity>,
  ) {}

  async create(dto: CreateCancelledDto): Promise<CancelledEntity> {
    const entity = this.cancelledRepository.create(dto);
    return this.cancelledRepository.save(entity);
  }

  async findAll(): Promise<CancelledEntity[]> {
    return this.cancelledRepository.find();
  }

  async findOne(id: number): Promise<CancelledEntity> {
    return this.cancelledRepository.findOneBy({ cancelledId: id });
  }

  async update(id: number, dto: UpdateCancelledDto): Promise<CancelledEntity> {
    await this.cancelledRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cancelledRepository.delete(id);
  }
} 