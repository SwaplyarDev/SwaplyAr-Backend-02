import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUserEntity } from '../entities/admin-user/admin-user.entity';
import { CreateAdminUserDto } from '../dto/admin-user/create-admin-user.dto';
import { UpdateAdminUserDto } from '../dto/admin-user/update-admin-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {}

  async create(dto: CreateAdminUserDto): Promise<AdminUserEntity> {
    const entity = this.adminUserRepository.create(dto);
    return this.adminUserRepository.save(entity);
  }

  async findAll(): Promise<AdminUserEntity[]> {
    return this.adminUserRepository.find();
  }

  async findOne(id: number): Promise<AdminUserEntity> {
    return this.adminUserRepository.findOneBy({ administrativoId: id });
  }

  async update(id: number, dto: UpdateAdminUserDto): Promise<AdminUserEntity> {
    await this.adminUserRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.adminUserRepository.delete(id);
  }
} 