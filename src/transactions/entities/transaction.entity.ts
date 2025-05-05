import { ReceiverBankAccount } from '@transactions/payment/payment-accounts/entities/receiverBankAccounts';
import { SenderBankAccount } from '@transactions/payment/payment-accounts/entities/senderBankAccounts';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', name: 'created_at'  })
  createdAt: Date;

  @Column({ name: 'created_by'})
  createdBy: string;

  @Column({ name:'final_status'})
  finalStatus: string;

  @ManyToOne(()=> SenderBankAccount, (sender) => sender.senderAccountId)
  @JoinColumn({name: 'sender_account_id'})
  senderAccount: SenderBankAccount;

  @ManyToOne(()=> ReceiverBankAccount,(receiver) => receiver.receiverAccountId)
  @JoinColumn({name: 'receiver_account_id'})
  receiverAccount: ReceiverBankAccount;

  

  

}
