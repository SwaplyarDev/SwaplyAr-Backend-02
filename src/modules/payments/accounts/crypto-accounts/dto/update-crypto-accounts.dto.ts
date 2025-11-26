import { PartialType } from '@nestjs/swagger';
import { CreateCryptoAccountDto } from './create-crypto-accounts.dto';

export class UpdateCryptoAccountDto extends PartialType(CreateCryptoAccountDto) {}
