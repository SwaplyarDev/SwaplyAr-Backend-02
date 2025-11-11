import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { PaymentPlatforms } from './platforms.entity';
import { BankAccount } from './bank-accounts.entity';
import { VirtualBankAccount } from './virtual-bank-accounts.entity';
import { CryptoAccount } from './crypto-accounts.entity'

@Entity('payment_providers')
@Unique(['payment_platforms', 'code'])
export class PaymentProviders {
  @PrimaryGeneratedColumn('uuid')
  payment_provider_id: string;

  @ManyToOne(() => PaymentPlatforms, (platform) => platform.providers, { nullable: false })
  payment_platform: PaymentPlatforms;

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

   @OneToMany(() => BankAccount, (bankAccount) => bankAccount.payment_provider)
  bank_accounts: BankAccount[];

  @OneToMany(() => VirtualBankAccount, (virtualAccount) => virtualAccount.payment_provider)
  virtual_bank_accounts: VirtualBankAccount[];

  @OneToMany(() => CryptoAccount, (cryptoAccount) => cryptoAccount.payment_provider)
  crypto_accounts: CryptoAccount[];
}
