import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { Platform } from 'src/enum/platform.enum';

@Entity('virtual_bank')
export class UserVirtualBank {
  @PrimaryGeneratedColumn('uuid', { name: 'virtual_bank_id' })
  virtual_bank_id: string;

  @Column({ name: 'account_type', nullable: true })
  accountType: Platform;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
