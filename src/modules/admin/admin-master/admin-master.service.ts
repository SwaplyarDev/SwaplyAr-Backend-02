import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminMasterEntity } from '../entities/admin-master/admin-master.entity';
import { CreateAdminMasterDto } from '../dto/admin-master/create-admin-master.dto';
import { UpdateAdminMasterDto } from '../dto/admin-master/update-admin-master.dto';

@Injectable()
export class AdminMasterService {
  constructor(
    @InjectRepository(AdminMasterEntity)
    private readonly adminMasterRepository: Repository<AdminMasterEntity>,
  ) {}

  async create(dto: CreateAdminMasterDto): Promise<AdminMasterEntity> {
    const entity = this.adminMasterRepository.create(dto);
    return this.adminMasterRepository.save(entity);
  }

  async findAll(): Promise<AdminMasterEntity[]> {
    return this.adminMasterRepository.find();
  }

  async findOne(id: number): Promise<AdminMasterEntity> {
    return this.adminMasterRepository.findOneBy({ admId: id });
  }

  async update(id: number, dto: UpdateAdminMasterDto): Promise<AdminMasterEntity> {
    await this.adminMasterRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.adminMasterRepository.delete(id);
  }
} 