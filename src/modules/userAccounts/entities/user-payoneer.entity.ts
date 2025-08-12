import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_payoneer')
export class UserPayoneer {
  @PrimaryGeneratedColumn('uuid', { name: 'payoneer_id' })
  payoneer_id: string;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'email_account' })
  email_account: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
