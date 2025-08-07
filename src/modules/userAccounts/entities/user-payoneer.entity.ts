import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { Platform } from 'src/enum/platform.enum';

@Entity('user_payoneer')
export class UserPayoneer {
  @PrimaryGeneratedColumn({ name: 'payoneer_id' })
  payoneer_id: Platform;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'email_account' })
  email_account: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
