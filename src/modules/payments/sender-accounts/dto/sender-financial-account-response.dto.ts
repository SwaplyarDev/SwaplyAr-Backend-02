import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@users/dto/user-response.dto';
import { PaymentProviderDto } from '../../payment-providers/dto/payment-providers-response.dto';

export class CountryDto {
  @ApiProperty({ example: 'AR' })
  @Expose()
  countryCode: string;

  @ApiProperty({ example: 'Argentina' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ARS', nullable: true })
  @Expose()
  currency: string | null;

  @ApiProperty({ example: 'es_AR', nullable: true })
  @Expose()
  locale: string | null;

  @ApiProperty({ example: '+54', nullable: true })
  @Expose()
  phonePrefix: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  @Expose()
  updatedAt: Date;
}

export class SenderFinancialAccountResponseDto {
  @ApiProperty()
  @Expose()
  senderAccountId: string;

  @ApiProperty({ type: PaymentProviderDto })
  @Expose()
  @Type(() => PaymentProviderDto)
  paymentProvider: PaymentProviderDto;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ nullable: true })
  @Expose()
  phoneNumber: string | null;

  @ApiProperty({ type: CountryDto, nullable: true })
  @Expose()
  @Type(() => CountryDto)
  country: CountryDto | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
