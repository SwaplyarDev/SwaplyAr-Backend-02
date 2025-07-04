import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { ReceiverFinancialAccount } from '@financial-accounts/receiver-financial-accounts/entities/receiver-financial-account.entity';
import { SenderFinancialAccount } from '@financial-accounts/sender-financial-accounts/entities/sender-financial-account.entity';
import { Amount } from '@transactions/amounts/entities/amount.entity';
import { TransactionStatus } from 'src/enum/trasanction-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Note } from '@transactions/notes/entities/note.entity';
import { Regret } from '@transactions/regrets/entities/regrets.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  id: string;

  // @Column({ name: 'payments_id' })
  // paymentsId: string; //para el recibo proof of payments

  @Column({ name: 'country_transaction' })
  countryTransaction: string;

  @Column({ name: 'message' })
  message: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
    name: 'final_status',
  })
  finalStatus: TransactionStatus;

  @ManyToOne(() => SenderFinancialAccount, (sender) => sender.transactions)
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount: SenderFinancialAccount;

  @ManyToOne(
    () => ReceiverFinancialAccount,
    (receiver) => receiver.transactions,
  )
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount: ReceiverFinancialAccount;

  @Column({ nullable: true, default: null })
  userId: string;

  @OneToOne(() => Note, (note) => note.transaction)
  @JoinColumn({ name: 'note_id' })
  note: Note;

  @OneToOne(() => Regret, (regret) => regret.transaction)
  @JoinColumn({ name: 'regret_id' })
  regret: Regret;

  @OneToOne(() => ProofOfPayment, (proof) => proof.transaction)
  @JoinColumn({ name: 'payments_id' })
  proofOfPayment: ProofOfPayment;

  @OneToOne(() => Amount)
  @JoinColumn({ name: 'amount_id' })
  amount: Amount;
}

// Relaciones de Transacciones y Pagos
// transactions.status_id > transaction_status.id_status
// transactions.sender_accounts_id > sender_bank_accounts.sender_accounts_id
// transactions.user_id > users.user_id
// transactions.regret_id > regrets.regret_id
// transactions.note_id > notes.note_id
// transactions.receiver_accounts_id > receiver_bank_accounts.receiver_accounts_id
// transactions.amount_id > amounts.amounts_id

// Relaciones del Historial de Transacciones
//transaction_state_history.transactions_id > transactions.transactions_id
//transaction_state_history.id_status  > transaction_status.id_status
//transaction_edit_history.transactions_id > transactions.transactions_id
//transaction_edit_history.edited_by > users.user_id
//transaction_edit_history.edited_by > notes.note_id
//regrets.payment_info_id > transaction_payment_info.payment_info_id
