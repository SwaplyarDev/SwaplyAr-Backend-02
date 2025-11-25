import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoNetworksService } from './crypto-networks.service';
import { CryptoNetworksController } from './crypto-networks.controller';
import { CryptoNetworks } from './crypto-networks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoNetworks])],
  controllers: [CryptoNetworksController],
  providers: [CryptoNetworksService],
  exports: [CryptoNetworksService],
})
export class CryptoNetworksModule {}
