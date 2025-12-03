import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { FinancialAccounts } from '../financial-accounts/financial-accounts.entity';


@Entity('payment_platforms')
export class PaymentPlatforms {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_platform_id' })
  paymentPlatformId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PaymentProviders, (provider) => provider.paymentPlatform)
  providers: PaymentProviders[];

  @OneToMany(() => FinancialAccounts, (account) => account.paymentPlatform)
  financialAccounts: FinancialAccounts[];
}
