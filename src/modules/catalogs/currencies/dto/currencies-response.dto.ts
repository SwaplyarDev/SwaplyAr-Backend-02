import { Expose } from 'class-transformer';

export class CurrencyResponseDto {
  @Expose()
  currencyId: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  symbol: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
