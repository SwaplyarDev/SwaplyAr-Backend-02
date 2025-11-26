import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { User } from '../../../../users/entities/user.entity';
import { PaymentProviders } from '../../../payment-providers/payment-providers.entity';

export class VirtualBankAccountResponseDto {
  @ApiProperty()
  @Expose()
  virtualBankAccountId: string;

  @ApiProperty({ type: () => User })
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty({ type: () => PaymentProviders })
  @Expose()
  @Type(() => PaymentProviders)
  paymentProvider: PaymentProviders;

  @ApiProperty()
  @Expose()
  emailAccount: string;

  @ApiPropertyOptional()
  @Expose()
  accountAlias?: string;

  @ApiPropertyOptional()
  @Expose()
  currency?: string;

  @ApiProperty()
  @Expose()
  ownerType: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
