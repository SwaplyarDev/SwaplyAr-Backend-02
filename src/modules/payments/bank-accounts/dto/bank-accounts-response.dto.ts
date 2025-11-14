import { Expose, Type } from 'class-transformer';

export class BankAccountResponseDto {
  @Expose()
  bank_account_id: string;

  @Expose()
  holder_name: string;

  @Expose()
  document_type?: string;

  @Expose()
  document_value?: string;

  @Expose()
  bank_name?: string;

  @Expose()
  account_number?: string;

  @Expose()
  iban?: string;

  @Expose()
  swift?: string;

  @Expose()
  currency?: string;

  @Expose()
  owner_type: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  // Relaciones simplificadas
  @Expose()
  @Type(() => String)
  user_id: string;

  @Expose()
  @Type(() => String)
  payment_provider_id: string;

  @Expose()
  @Type(() => String)
  created_by_id: string;
}
