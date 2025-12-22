import { Expose } from 'class-transformer';

export class CountryResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  currencyId: string;

  @Expose()
  createdAt: Date;
}
