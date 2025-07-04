import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_paypal')
export class UserPayPal {
  @PrimaryGeneratedColumn({ name: 'paypal_id' })
  paypal_id: number;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'email_account' })
  email_account: string;

  @Column({ name: 'transfer_code', type: 'int' })
  transfer_code: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
