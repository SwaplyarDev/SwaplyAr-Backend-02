import { Injectable } from '@nestjs/common';
import { CreateAmountDto } from './dto/create-amount.dto';
import { UpdateAmountDto } from './dto/update-amount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amount } from './entities/amount.entity'; 

@Injectable()
export class AmountsService {
  constructor(@InjectRepository(Amount) private readonly amountsRepository : Repository<Amount> ){}
  async create(createAmountDto: CreateAmountDto) {
    const newAmount = this.amountsRepository.create(createAmountDto)
    return await this.amountsRepository.save(newAmount);
  }

  findAll() {
    return `This action returns all amounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amount`;
  }

  update(id: number, updateAmountDto: UpdateAmountDto) {
    return `This action updates a #${id} amount`;
  }

  remove(id: number) {
    return `This action removes a #${id} amount`;
  }
}
