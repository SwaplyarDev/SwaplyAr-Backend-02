import { Expose, Type } from 'class-transformer';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { CryptoNetworks } from '../../../catalogs/crypto-networks/crypto-networks.entity';

export class CryptoAccountResponseDto {
  @Expose()
  bank_account_id: string;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => PaymentProviders)
  payment_provider: PaymentProviders;

  @Expose()
  @Type(() => CryptoNetworks)
  crypto_network: CryptoNetworks;

  @Expose()
  wallet_address: string;

  @Expose()
  tag_or_memo?: string;

  @Expose()
  owner_type: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;
}
