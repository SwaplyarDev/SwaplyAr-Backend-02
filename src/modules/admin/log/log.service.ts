import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from '../entities/log/log.entity';
import { CreateLogDto } from '../dto/log/create-log.dto';
import { UpdateLogDto } from '../dto/log/update-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async create(dto: CreateLogDto): Promise<LogEntity> {
    const entity = this.logRepository.create(dto);
    return this.logRepository.save(entity);
  }

  async findAll(): Promise<LogEntity[]> {
    return this.logRepository.find();
  }

  async findOne(id: number): Promise<LogEntity> {
    return this.logRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateLogDto): Promise<LogEntity> {
    await this.logRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.logRepository.delete(id);
  }
} 