import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_receiver_crypto')
export class UserReceiverCrypto {
  @PrimaryGeneratedColumn('uuid', { name: 'receiver_crypto' })
  receiver_crypto: string;

  @Column()
  currency: string;

  @Column()
  network: string;

  @Column()
  wallet: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'accountId' })
  userAccount: UserAccount;
}
