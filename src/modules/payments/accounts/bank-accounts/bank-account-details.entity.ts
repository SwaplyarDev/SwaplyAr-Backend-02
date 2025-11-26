import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { BankAccounts } from './bank-accounts.entity';

@Entity({ name: 'bank_account_details' })
export class BankAccountDetails {
  @PrimaryGeneratedColumn('uuid', { name: 'bank_account_detail_id' })
  bankAccountDetailId: string;

  @ManyToOne(() => BankAccounts, (bankAccount: BankAccounts) => bankAccount.details, {
    nullable: false,
  })
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccounts;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'field_key' })
  fieldKey: string;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'field_label' })
  fieldLabel: string;

  @Column({ type: 'varchar', nullable: false, name: 'field_value' })
  fieldValue: string;

  @Column({ type: 'boolean', default: false, name: 'is_encrypted' })
  isEncrypted: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;
}
