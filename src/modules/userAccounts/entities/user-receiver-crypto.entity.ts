import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_receiver_crypto')
export class UserReceiverCrypto {
  @PrimaryGeneratedColumn('uuid', { name: 'crypto_id' })
  cryptoId: string;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column()
  currency: string;

  @Column()
  network: string;

  @Column()
  wallet: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}
