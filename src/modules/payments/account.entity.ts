import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Provider } from './provider.entity';
import { UserAccount } from '../userAccounts/entities/user-account.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.accountName)
  userAccount: UserAccount;

  @ManyToOne(() => Provider, (provider) => provider.accounts)
  provider: Provider;

  @Column({ nullable: true })
  alias: string;

  @Column({ type: 'jsonb' })
  account_data: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
