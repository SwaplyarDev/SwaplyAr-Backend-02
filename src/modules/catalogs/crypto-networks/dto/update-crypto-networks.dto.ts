import { CreateCryptoNetworkDto } from './create-crypto-networks.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCryptoNetworkDto extends PartialType(CreateCryptoNetworkDto) {}
