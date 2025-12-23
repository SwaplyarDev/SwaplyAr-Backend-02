import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../currencies/currencies.entity';
import { PaymentProviders } from 'src/modules/payments/payment-providers/entities/payment-providers.entity';
import { SenderFinancialAccount } from 'src/modules/payments/sender-accounts/entities/sender-financial-account.entity';
@Entity('countries')
export class Countries {
  @PrimaryGeneratedColumn('uuid', { name: 'country_id' })
  id: string;

  @Column({ type: 'char', length: 3, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Currency, (currency) => currency.countries)
  @JoinTable({
    name: 'countries_currencies',
    joinColumn: {
      name: 'country_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'currency_id',
      referencedColumnName: 'currencyId',
    },
  })
  currencies: Currency[];

  @OneToMany(() => PaymentProviders, (provider) => provider.country)
  providers: PaymentProviders[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SenderFinancialAccount, (senderAccount) => senderAccount.country)
  senderFinancialAccounts: SenderFinancialAccount[];
}
