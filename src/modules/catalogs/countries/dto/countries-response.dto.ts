import { Expose } from 'class-transformer';

export class CountryResponseDto {
  @Expose()
  country_id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  currency_default?: string;

  @Expose()
  created_at: Date;
}
