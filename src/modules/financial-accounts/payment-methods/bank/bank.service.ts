import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank) private readonly bankRepository: Repository<Bank>,
  ) {}

  async create(
    createBankDto: CreateBankDto,
    platformId: string,
    method: string,
  ) {
    const newBank = this.bankRepository.create({
      ...createBankDto,
      platformId,
      method,
    });
    return await this.bankRepository.save(newBank);
  }

  async findAll() {
    return await this.bankRepository.find();
  }
}
