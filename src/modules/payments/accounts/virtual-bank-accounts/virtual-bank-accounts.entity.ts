import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { User } from '../../../users/entities/user.entity';

@Entity({ name: 'virtual_bank_accounts' })
export class VirtualBankAccounts {
  @PrimaryGeneratedColumn('uuid', { name: 'virtual_bank_account_id' })
  virtualBankAccountId: string;

  @ManyToOne(() => User, (user) => user.virtualBankAccounts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.virtualBankAccounts, {
    nullable: false,
  })
  @JoinColumn({ name: 'payment_provider_id' })
  paymentProvider: PaymentProviders;

  @Column({ type: 'varchar', nullable: false, name: 'email_account' })
  emailAccount: string;

  @Column({ type: 'varchar', nullable: true, name: 'account_alias' })
  accountAlias: string;

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
