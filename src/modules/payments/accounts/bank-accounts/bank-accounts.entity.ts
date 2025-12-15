import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PaymentProviders } from '../../payment-providers/entities/payment-providers.entity';
import { User } from '../../../users/entities/user.entity';
import { BankAccountDetails } from './bank-account-details.entity';

@Entity({ name: 'bank_accounts' })
export class BankAccounts {
  @PrimaryGeneratedColumn('uuid', { name: 'bank_account_id' })
  bankAccountId: string;

  @ManyToOne(() => User, (user) => user.bankAccounts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.bankAccounts, { nullable: false })
  @JoinColumn({ name: 'payment_provider_id' })
  paymentProvider: PaymentProviders;

  @OneToMany(() => BankAccountDetails, (detail) => detail.bankAccount)
  details: BankAccountDetails[];

  @Column({ type: 'varchar', length: 3, nullable: false, name: 'country_code' })
  countryCode: string;

  @Column({ type: 'varchar', nullable: false, name: 'holder_name' })
  holderName: string;

  @Column({ type: 'varchar', nullable: true, name: 'document_type' })
  documentType: string;

  @Column({ type: 'varchar', nullable: true, name: 'document_value' })
  documentValue: string;

  @Column({ type: 'varchar', nullable: true, name: 'bank_name' })
  bankName: string;

  @Column({ type: 'varchar', nullable: true, name: 'account_number' })
  accountNumber: string;

  @Column({ type: 'varchar', nullable: true })
  iban: string;

  @Column({ type: 'varchar', nullable: true })
  swift: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'user', name: 'owner_type' })
  ownerType: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;
}
