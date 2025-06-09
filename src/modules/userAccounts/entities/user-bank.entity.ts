import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_bank')
export class UserBank {
  @PrimaryGeneratedColumn('uuid', { name: 'bank_id' })
  bankId: string;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'bank_name' })
  bank_name: string;

  @Column({ name: 'send_method_key' })
  send_method_key: string;

  @Column({ name: 'send_method_value' })
  send_method_value: string;

  @Column({ name: 'document_type' })
  document_type: string;

  @Column({ name: 'document_value', type: 'numeric' })
  document_value: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  userAccount: UserAccount;
}