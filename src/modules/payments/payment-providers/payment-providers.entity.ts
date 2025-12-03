import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { BankAccounts } from '../accounts/bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../accounts/virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../accounts/crypto-accounts/crypto-accounts.entity';
import { Countries } from 'src/modules/catalogs/countries/countries.entity';

@Entity({ name: 'payment_providers' })
@Unique(['paymentPlatform', 'code'])
export class PaymentProviders {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_provider_id' })
  paymentProviderId: string;

  @ManyToOne(() => PaymentPlatforms, (platform) => platform.providers, { nullable: false })
  @JoinColumn({ name: 'payment_platform_id' })
  paymentPlatform: PaymentPlatforms;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ManyToOne(() => Countries, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Countries;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @Column({ type: 'varchar', nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ type: 'varchar', length: 10, default: 'both', name: 'operation_type' })
  operationType: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BankAccounts, (bankAccount: BankAccounts) => bankAccount.paymentProvider)
  bankAccounts: BankAccounts[];

  @OneToMany(
    () => VirtualBankAccounts,
    (virtualAccount: VirtualBankAccounts) => virtualAccount.paymentProvider,
  )
  virtualBankAccounts: VirtualBankAccounts[];

  @OneToMany(() => CryptoAccounts, (cryptoAccount: CryptoAccounts) => cryptoAccount.paymentProvider)
  cryptoAccounts: CryptoAccounts[];
}
