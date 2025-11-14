import { Expose, Type } from 'class-transformer';

export class PaymentPlatformResponseDto {
  @Expose()
  payment_platform_id: string;

  @Expose()
  code: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => String)
  providers?: string[];

  @Expose()
  @Type(() => String)
  financialAccounts?: string[];
}
