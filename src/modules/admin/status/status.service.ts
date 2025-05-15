import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../entities/status/status.entity';
import { CreateStatusDto } from '../dto/status/create-status.dto';
import { UpdateStatusDto } from '../dto/status/update-status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async create(dto: CreateStatusDto): Promise<StatusEntity> {
    const entity = this.statusRepository.create(dto);
    return this.statusRepository.save(entity);
  }

  async findAll(): Promise<StatusEntity[]> {
    return this.statusRepository.find();
  }

  async findOne(id: number): Promise<StatusEntity> {
    return this.statusRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateStatusDto): Promise<StatusEntity> {
    await this.statusRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.statusRepository.delete(id);
  }
} 