import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReceiverCrypto } from "./entities/receiver-crypto.entity";
import { Repository } from "typeorm";
import { CreateReceiverCryptoDto } from "./dto/create-receiver-crypto.dto";

@Injectable()
export class ReceiverCryptoService {
  constructor(@InjectRepository(ReceiverCrypto)
    private readonly receiverCryptoRepository: Repository<ReceiverCrypto>,
  ) {}

  async create(createReceiverCryptoDto: CreateReceiverCryptoDto, platformId: string) {
    if (createReceiverCryptoDto) {
      const newReceiverCrypto = this.receiverCryptoRepository.create({ ...createReceiverCryptoDto, platformId });
      return await this.receiverCryptoRepository.save(newReceiverCrypto);
    } else {
      return null;
    }
  }

}