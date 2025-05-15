import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovedEntity } from '../entities/approved/approved.entity';
import { CreateApprovedDto } from '../dto/approved/create-approved.dto';
import { UpdateApprovedDto } from '../dto/approved/update-approved.dto';

@Injectable()
export class ApprovedService {
  constructor(
    @InjectRepository(ApprovedEntity)
    private readonly approvedRepository: Repository<ApprovedEntity>,
  ) {}

  async create(dto: CreateApprovedDto): Promise<ApprovedEntity> {
    const entity = this.approvedRepository.create(dto);
    return this.approvedRepository.save(entity);
  }

  async findAll(): Promise<ApprovedEntity[]> {
    return this.approvedRepository.find();
  }

  async findOne(id: number): Promise<ApprovedEntity> {
    return this.approvedRepository.findOneBy({ approvedId: id });
  }

  async update(id: number, dto: UpdateApprovedDto): Promise<ApprovedEntity> {
    await this.approvedRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.approvedRepository.delete(id);
  }
} 