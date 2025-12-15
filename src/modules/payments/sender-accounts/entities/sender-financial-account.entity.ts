import { Transaction } from '@transactions/entities/transaction.entity';
import {
  Column,
  OneToMany,
  Index,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Countries } from 'src/modules/payments/entities/countries.entity';
import { User } from '@users/entities/user.entity';
import { PaymentProviders } from '../../payment-providers/entities/payment-providers.entity';

@Entity('sender_accounts')
export class SenderFinancialAccount {
  @Index('idx_sender_fin_accounts_payment_sender_account_id')
  @PrimaryGeneratedColumn('uuid', { name: 'sender_account_id' })
  senderAccountId: string;

  @ManyToOne(() => PaymentProviders, (pmntProvider) => pmntProvider.senderAccounts)
  @JoinColumn({ name: 'payment_provider_id' })
  paymentProvider: PaymentProviders;

  @Index('idx_sender_fin_accounts_first_name')
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  @Expose()
  firstName: string;

  @Index('idx_sender_fin_accounts_last_name')
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  @Expose()
  lastName: string;

  @ManyToOne(() => User, (usr) => usr.senderAccounts)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user: User;

  @Index('idx_sender_fin_accounts_phone')
  @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
  @Expose()
  @IsOptional()
  phoneNumber: string;

  @ManyToOne(() => Countries, (ctr) => ctr.senderFinancialAccounts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'country_code' })
  country: Countries;

  @Index('idx_sender_fin_accounts_created_at')
  @Column({ name: 'created_at', type: 'timestamptz' })
  @Expose()
  createdAt: Date;

  @Index('idx_sender_fin_accounts_updated_at')
  @Column({ name: 'updated_at', type: 'timestamptz' })
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];
}
