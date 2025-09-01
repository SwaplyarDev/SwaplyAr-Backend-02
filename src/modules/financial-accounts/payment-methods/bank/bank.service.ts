import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { Platform } from 'src/enum/platform.enum';

@Injectable()
export class BankService {
  constructor(@InjectRepository(Bank) private readonly bankRepository: Repository<Bank>) {}

  async create(createBankDto: CreateBankDto, platformId: Platform, method: string) {
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

  async update(id: string, updateBankDto: Partial<CreateBankDto>) {
    await this.bankRepository.update({ id }, updateBankDto);
    return this.bankRepository.findOne({ where: { id } });
  }
}
