import { Injectable } from '@nestjs/common';
import { CreateAmountDto } from './dto/create-amount.dto';
import { UpdateAmountDto } from './dto/update-amount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amount } from './entities/amount.entity';

@Injectable()
export class AmountsService {
  constructor(
    @InjectRepository(Amount)
    private readonly amountsRepository: Repository<Amount>,
  ) {}
  async create(createAmountDto: CreateAmountDto) {
    const newAmount = this.amountsRepository.create({
      ...createAmountDto,
      received: false,
    });
    //una vez completada la transacción, se cambia el estado a true de received
    return await this.amountsRepository.save(newAmount);
  }

  findAll() {
    return `This action returns all amounts`;
  }

  findOne(id: string) {
    return this.amountsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateAmountDto: UpdateAmountDto) {
    return await this.amountsRepository.update({ id }, updateAmountDto);
  }

  async remove(id: string) {
    return await this.amountsRepository.delete({ id });
  }
}
