import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PaymentProviders } from './providers.entity';
import { User } from '../../users/entities/user.entity';

@Entity('virtual_bank_accounts')
export class VirtualBankAccounts {
  @PrimaryGeneratedColumn('uuid')
  bank_account_id: string;

  @ManyToOne(() => User, (user) => user.virtual_bank_accounts, { nullable: false })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.virtual_bank_accounts, {
    nullable: false,
  })
  payment_provider: PaymentProviders;

  @Column({ type: 'varchar', nullable: false })
  email_account: string;

  @Column({ type: 'varchar', nullable: true })
  account_alias: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  owner_type: string;

  @ManyToOne(() => User, { nullable: false })
  created_by: User;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;
}
