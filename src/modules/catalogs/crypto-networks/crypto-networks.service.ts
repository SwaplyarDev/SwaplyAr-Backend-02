import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoNetworks } from './crypto-networks.entity';
import { CreateCryptoNetworkDto } from './dto/create-crypto-networks.dto';
import { UpdateCryptoNetworkDto } from './dto/update-crypto-networks.dto';

@Injectable()
export class CryptoNetworksService {
  constructor(
    @InjectRepository(CryptoNetworks)
    private readonly cryptoNetworksRepository: Repository<CryptoNetworks>,
  ) {}

  async create(createCryptoNetworkDto: CreateCryptoNetworkDto): Promise<CryptoNetworks> {
    const existingNetwork = await this.cryptoNetworksRepository.findOne({
      where: { code: createCryptoNetworkDto.code },
    });

    if (existingNetwork) {
      throw new ConflictException(
        `Crypto Network with code ${createCryptoNetworkDto.code} already exists`,
      );
    }

    const cryptoNetwork = this.cryptoNetworksRepository.create(createCryptoNetworkDto);
    return this.cryptoNetworksRepository.save(cryptoNetwork);
  }

  async findAll(): Promise<CryptoNetworks[]> {
    return this.cryptoNetworksRepository.find();
  }

  async findOne(id: string): Promise<CryptoNetworks> {
    const cryptoNetwork = await this.cryptoNetworksRepository.findOne({
      where: { cryptoNetworkId: id },
    });

    if (!cryptoNetwork) {
      throw new NotFoundException(`Crypto Network with ID ${id} not found`);
    }

    return cryptoNetwork;
  }

  async update(
    id: string,
    updateCryptoNetworkDto: UpdateCryptoNetworkDto,
  ): Promise<CryptoNetworks> {
    const cryptoNetwork = await this.findOne(id);

    Object.assign(cryptoNetwork, updateCryptoNetworkDto);

    return this.cryptoNetworksRepository.save(cryptoNetwork);
  }

  async remove(id: string): Promise<void> {
    const cryptoNetwork = await this.findOne(id);
    await this.cryptoNetworksRepository.remove(cryptoNetwork);
  }
}
