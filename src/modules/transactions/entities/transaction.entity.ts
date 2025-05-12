import { ReceiverFinancialAccount } from '@financial-accounts/receiver-financial-accounts/entities/receiver-financial-account.entity';
import { SenderFinancialAccount } from '@financial-accounts/sender-financial-accounts/entities/sender-financial-account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  id: string;

  @Column({ name: 'payments_id' })
  paymentsId: string;

  @Column({ name: 'country_transaction' })
  countryTransaction: string;

  @Column({ name: 'message' })
  message: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'final_status' })
  finalStatus: string;

  @ManyToOne(() => SenderFinancialAccount, (sender) => sender.transactions)
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount: SenderFinancialAccount;

  @ManyToOne(
    () => ReceiverFinancialAccount,
    (receiver) => receiver.transactions,
  )
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount: ReceiverFinancialAccount;

  //userId
  //regretId
  //amountId
  //noteId
}
