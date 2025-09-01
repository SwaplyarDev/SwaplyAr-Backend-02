import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pix } from './entities/pix.entity';
import { Repository } from 'typeorm';
import { CreatePixDto } from './dto/create-pix.dto';
import { Platform } from 'src/enum/platform.enum';

@Injectable()
export class PixService {
  constructor(@InjectRepository(Pix) private readonly pixRepository: Repository<Pix>) {}

  async create(createPixDto: CreatePixDto, platformId: Platform, method: string) {
    const newPix = this.pixRepository.create({
      ...createPixDto,
      platformId,
      method,
    });
    return await this.pixRepository.save(newPix);
  }

  async findAll() {
    return await this.pixRepository.find();
  }
}
