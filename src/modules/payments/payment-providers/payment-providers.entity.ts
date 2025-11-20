import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { BankAccounts } from '../bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../crypto-accounts/crypto-accounts.entity';

@Entity('payment_providers')
@Unique(['payment_platform', 'code'])
export class PaymentProviders {
  @PrimaryGeneratedColumn('uuid')
  payment_provider_id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @ManyToOne(() => PaymentPlatforms, (platform) => platform.providers, { nullable: false })
  @JoinColumn({ name: 'payment_platform_id' })
  payment_platform: PaymentPlatforms;

  @Column({ type: 'uuid' })
  payment_platform_id: string;

  @OneToMany(() => BankAccounts, (bankAccount) => bankAccount.payment_provider)
  bank_accounts: BankAccounts[];

  @OneToMany(() => VirtualBankAccounts, (virtualAccount) => virtualAccount.payment_provider)
  virtual_bank_accounts: VirtualBankAccounts[];

  @OneToMany(() => CryptoAccounts, (cryptoAccount) => cryptoAccount.payment_provider)
  crypto_accounts: CryptoAccounts[];
}
