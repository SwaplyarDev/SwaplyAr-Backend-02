import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { CryptoNetworks } from '../../../catalogs/crypto-networks/crypto-networks.entity';

export class CryptoAccountResponseDto {
  @ApiProperty()
  @Expose()
  cryptoAccountId: string;

  @ApiProperty({ type: () => User })
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty({ type: () => PaymentProviders })
  @Expose()
  @Type(() => PaymentProviders)
  paymentProvider: PaymentProviders;

  @ApiProperty({ type: () => CryptoNetworks })
  @Expose()
  @Type(() => CryptoNetworks)
  cryptoNetwork: CryptoNetworks;

  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiPropertyOptional()
  @Expose()
  tagOrMemo?: string;

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
