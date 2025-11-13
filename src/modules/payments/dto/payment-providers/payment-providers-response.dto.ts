import { Expose, Type } from 'class-transformer';

export class PaymentProviderResponseDto {
  @Expose()
  payment_provider_id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  country?: string;

  @Expose()
  logo_url?: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => String)
  payment_platform_id: string;
}
