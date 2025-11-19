import { Expose, Type } from 'class-transformer';
import { CryptoAccounts } from '../../../payments/crypto-accounts/crypto-accounts.entity';

export class CryptoNetworkResponseDto {
  @Expose()
  crypto_network_id: string;

  @Expose()
  code: string;

  @Expose()
  title: string;

  @Expose()
  logo_url?: string;

  @Expose()
  description?: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => CryptoAccounts)
  crypto_accounts?: CryptoAccounts[];
}
