import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { User } from '../../../../users/entities/user.entity';
import { PaymentProviders } from 'src/modules/payments/payment-providers/entities/payment-providers.entity';
import { CurrencyResponseDto } from 'src/modules/catalogs/currencies/dto/currencies-response.dto';
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

  @ApiPropertyOptional({ type: () => CurrencyResponseDto })
  @Expose()
  @Type(() => CurrencyResponseDto)
  currency?: CurrencyResponseDto;

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
