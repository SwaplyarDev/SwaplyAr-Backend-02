import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Regret } from './entities/regrets.entity';
import { CreateRegretDto } from './dto/create-regret.dto';
import { UpdateRegretDto } from './dto/update-regret.dto';

@Injectable()
export class RegretsService {
  constructor(
    @InjectRepository(Regret)
    private readonly regretsRepository: Repository<Regret>,
  ) {}

  create(createRegretDto: CreateRegretDto) {
    const regret = this.regretsRepository.create(createRegretDto);
    return this.regretsRepository.save(regret);
  }

  findAll() {
    return this.regretsRepository.find();
  }

  findOne(id: string) {
    return this.regretsRepository.findOne({ where: { id } });
  }

  update(id: string, updateRegretDto: UpdateRegretDto) {
    return this.regretsRepository.update(id, updateRegretDto);
  }

  remove(id: string) {
    return this.regretsRepository.delete(id);
  }
}
