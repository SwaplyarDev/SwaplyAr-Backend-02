import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { PaymentProviders } from './providers.entity';
import { Users } from './users.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  bank_account_id: string;

  @ManyToOne(() => User, (user) => user.bank_accounts, { nullable: false })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.bank_accounts, { nullable: false })
  payment_provider: PaymentProviders;

  @Column({ type: 'varchar', nullable: false })
  holder_name: string;

  @Column({ type: 'varchar', nullable: true })
  document_type: string;

  @Column({ type: 'varchar', nullable: true })
  document_value: string;

  @Column({ type: 'varchar', nullable: true })
  bank_name: string;

  @Column({ type: 'varchar', nullable: true })
  account_number: string;

  @Column({ type: 'varchar', nullable: true })
  iban: string;

  @Column({ type: 'varchar', nullable: true })
  swift: string;

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
