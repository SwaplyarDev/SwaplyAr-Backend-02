import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_wise')
export class UserWise {
  @PrimaryGeneratedColumn({ name: 'wise_id' })
  wise_id: number;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column()
  iban: string;

  @Column()
  bic: string;

  @Column({ name: 'email_account' })
  email_account: string;

  @Column({ name: 'transfer_code', type: 'int' })
  transfer_code: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
