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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PaymentPlatforms } from '../../payment-platforms/entities/payment-platforms.entity';
import { BankAccounts } from '../../accounts/bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../../accounts/virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../../accounts/crypto-accounts/crypto-accounts.entity';
import { SenderFinancialAccount } from '../../sender-accounts/entities/sender-financial-account.entity';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';
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

  @ManyToOne(() => Countries, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Countries;

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

  @OneToMany(() => SenderFinancialAccount, (sdrAccount) => sdrAccount.paymentProvider)
  senderAccounts: SenderFinancialAccount;

  @ManyToMany(() => Currency, (currency) => currency.providers)
  @JoinTable({
    name: 'provider_currencies',
    joinColumn: {
      name: 'provider_id',
      referencedColumnName: 'paymentProviderId',
    },
    inverseJoinColumn: {
      name: 'currency_id',
      referencedColumnName: 'currencyId',
    },
  })
  supportedCurrencies: Currency[];
}
