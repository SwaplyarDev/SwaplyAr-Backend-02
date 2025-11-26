import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, OneToMany, Index, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Entity('sender_accounts')
export class SenderFinancialAccount {
  @Index('idx_sender_fin_accounts_payment_sender_account_id')
  @PrimaryGeneratedColumn('uuid', { name: 'sender_account_id' })
  senderAccountId: string;

  @Index('idx_sender_fin_accounts_first_name')
  @Column({ name: 'first_name' })
  @Expose()
  firstName: string;

  @Index('idx_sender_fin_accounts_last_name')
  @Column({ name: 'last_name' })
  @Expose()
  lastName: string;

  @Index('idx_sender_fin_accounts_payment_platform_id')
  @Column({
    type: 'uuid',
    name: 'payment_platform_id',
  })
  paymentPlatformId: string; // FK → payment_platforms (bank, virtual_bank, receiver_crypto)

  @Index('idx_sender_fin_accounts_email')
  @Column({ name: 'email' })
  @Expose()
  email: string;

  @Index('idx_sender_fin_accounts_phone')
  @Column({ name: 'phone_number' })
  @Expose()
  @IsOptional()
  phoneNumber: string;

  @Index('idx_sender_fin_accounts_country_code')
  @Column({ type: 'varchar', name: 'country_code' })
  countryCode: string; // codigo del país específico (p. ej. AR o BR)

  @Index('idx_sender_fin_accounts_created_at')
  @Column({ name: 'created_at' })
  @Expose()
  createdAt: Date;

  @Index('idx_sender_fin_accounts_updated_at')
  @Column({ name: 'updated_at' })
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];
}
