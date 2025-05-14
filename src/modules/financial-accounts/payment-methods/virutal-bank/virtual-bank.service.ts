import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VirtualBank } from './entities/virtual-bank.entity';
import { Repository } from 'typeorm';
import { CreateVirtualBankDto } from './dto/create-virtual-bank.dto';

@Injectable()
export class VirtualBankService {
  constructor(
    @InjectRepository(VirtualBank)
    private readonly virtualBankRepository: Repository<VirtualBank>,
  ) {}

  async create(
    createVirtualBankDto: CreateVirtualBankDto,
    platformId: string,
    method: string,
  ) {
    const newVirtualBank = this.virtualBankRepository.create({
      ...createVirtualBankDto,
      platformId,
      method,
    });
    return await this.virtualBankRepository.save(newVirtualBank);
  }
}
