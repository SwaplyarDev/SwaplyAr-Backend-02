import { Expose, Type } from 'class-transformer';
import { CryptoAccounts } from '../../../payments/crypto-accounts/crypto-accounts.entity';

export class CryptoNetworkResponseDto {
  @Expose()
  cryptoNetworkId: string;

  @Expose()
  code: string;

  @Expose()
  title: string;

  @Expose()
  logoUrl?: string;

  @Expose()
  description?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => CryptoAccounts)
  cryptoAccounts?: CryptoAccounts[];
}
