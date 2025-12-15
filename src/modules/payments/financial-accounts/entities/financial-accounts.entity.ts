import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PaymentPlatforms } from '../../payment-platforms/entities/payment-platforms.entity';
import { User } from '@users/entities/user.entity';
import { Transaction } from '@transactions/entities/transaction.entity';

@Entity({ name: 'financial_accounts' })
export class FinancialAccounts {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  financialAccountId: string;

  @ManyToOne(() => PaymentPlatforms, (platform) => platform.financialAccounts, { nullable: false })
  @JoinColumn({ name: 'payment_platform_id' })
  paymentPlatform: PaymentPlatforms;

  @Column({ type: 'uuid', name: 'reference_id' })
  referenceId: string;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20, default: 'user', name: 'owner_type' })
  ownerType: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.financialAccounts)
  transactions: Transaction[];
}
