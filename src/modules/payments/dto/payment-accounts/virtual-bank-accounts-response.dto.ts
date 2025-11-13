import { Expose, Type } from 'class-transformer';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';

export class VirtualBankAccountResponseDto {
  @Expose()
  bank_account_id: string;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => PaymentProviders)
  payment_provider: PaymentProviders;

  @Expose()
  email_account: string;

  @Expose()
  account_alias?: string;

  @Expose()
  currency?: string;

  @Expose()
  owner_type: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;
}
