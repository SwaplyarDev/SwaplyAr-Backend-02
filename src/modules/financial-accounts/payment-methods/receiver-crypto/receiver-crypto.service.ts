import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiverCrypto } from './entities/receiver-crypto.entity';
import { Repository } from 'typeorm';
import { CreateReceiverCryptoDto } from './dto/create-receiver-crypto.dto';
import { Platform } from 'src/enum/platform.enum';

@Injectable()
export class ReceiverCryptoService {
  constructor(
    @InjectRepository(ReceiverCrypto)
    private readonly receiverCryptoRepository: Repository<ReceiverCrypto>,
  ) {}

  async create(
    createReceiverCryptoDto: CreateReceiverCryptoDto,
    platformId: Platform,
    method: string,
  ) {
    const newReceiverCrypto = this.receiverCryptoRepository.create({
      ...createReceiverCryptoDto,
      platformId,
      method,
    });
    return await this.receiverCryptoRepository.save(newReceiverCrypto);
  }
}
