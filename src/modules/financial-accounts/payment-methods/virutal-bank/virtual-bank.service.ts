import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VirtualBank } from './entities/virtual-bank.entity';
import { Repository } from 'typeorm';
import { CreateVirtualBankDto } from './dto/create-virtual-bank.dto';
import { Platform } from 'src/enum/platform.enum';

@Injectable()
export class VirtualBankService {
  constructor(
    @InjectRepository(VirtualBank)
    private readonly virtualBankRepository: Repository<VirtualBank>,
  ) {}

  async create(createVirtualBankDto: CreateVirtualBankDto, platformId: Platform, method: string, type: string) {
    const newVirtualBank = this.virtualBankRepository.create({
      ...createVirtualBankDto,
      platformId,
      method,
      type,
    });
    return await this.virtualBankRepository.save(newVirtualBank);
  }
}
