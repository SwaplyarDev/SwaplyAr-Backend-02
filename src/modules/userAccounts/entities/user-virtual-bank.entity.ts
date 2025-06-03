import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('virtual_bank')
export class UserVirtualBank {
  @PrimaryGeneratedColumn('uuid', { name: 'virtual_bank_id' })
  virtual_bank_id: string;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'email_account' })
  email_account: string;

  @Column({ name: 'transfer_code' })
  transfer_code: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}