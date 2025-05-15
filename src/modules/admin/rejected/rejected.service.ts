import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RejectedEntity } from '../entities/rejected/rejected.entity';
import { CreateRejectedDto } from '../dto/rejected/create-rejected.dto';
import { UpdateRejectedDto } from '../dto/rejected/update-rejected.dto';

@Injectable()
export class RejectedService {
  constructor(
    @InjectRepository(RejectedEntity)
    private readonly rejectedRepository: Repository<RejectedEntity>,
  ) {}

  async create(dto: CreateRejectedDto): Promise<RejectedEntity> {
    const entity = this.rejectedRepository.create(dto);
    return this.rejectedRepository.save(entity);
  }

  async findAll(): Promise<RejectedEntity[]> {
    return this.rejectedRepository.find();
  }

  async findOne(id: number): Promise<RejectedEntity> {
    return this.rejectedRepository.findOneBy({ rejectedId: id });
  }

  async update(id: number, dto: UpdateRejectedDto): Promise<RejectedEntity> {
    await this.rejectedRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rejectedRepository.delete(id);
  }
} 