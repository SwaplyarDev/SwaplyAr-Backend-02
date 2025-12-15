import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { FinancialAccounts } from 'src/modules/payments/financial-accounts/entities/financial-accounts.entity';

@Entity('user_account')
export class UserAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'account_id' })
  accountId: string;

  @Column({ name: 'account_name', nullable: true })
  accountName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  // 🔹 Guardamos solo el userId
  @Column({ name: 'user_id' })
  userId: string;

  // 🔗 Relación 1:1 con FinancialAccount
  @OneToOne(() => FinancialAccounts, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'financial_account_id' })
  financialAccount: FinancialAccounts;
}
