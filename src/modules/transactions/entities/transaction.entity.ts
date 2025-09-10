import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { ReceiverFinancialAccount } from '@financial-accounts/receiver-financial-accounts/entities/receiver-financial-account.entity';
import { SenderFinancialAccount } from '@financial-accounts/sender-financial-accounts/entities/sender-financial-account.entity';
import { Amount } from '@transactions/amounts/entities/amount.entity';

import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';

import { customAlphabet } from 'nanoid';
import { Note } from '@transactions/notes/entities/note.entity';
import { Regret } from '@transactions/regrets/entities/regrets.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { AdminStatus } from 'src/enum/admin-status.enum';

export const nanoidCustom = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  10,
);

@Entity('transactions')
export class Transaction {
  @PrimaryColumn({ name: 'transaction_id', type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoidCustom(); // genera un string de 10 caracteres sin "-" ni "_"
  }

  @Column({ name: 'country_transaction' })
  countryTransaction: string;

  @Column({ name: 'message', nullable: true })
  message: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.Pending,
    name: 'final_status',
  })
  finalStatus: AdminStatus;

  @ManyToOne(() => SenderFinancialAccount, (sender) => sender.transactions)
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount: SenderFinancialAccount;

  @ManyToOne(() => ReceiverFinancialAccount, (receiver) => receiver.transactions)
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount: ReceiverFinancialAccount;

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

  @OneToOne(() => UserDiscount, (userDiscount) => userDiscount.transaction)
  userDiscount: UserDiscount;

  @Column({ default: false })
  isNoteVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  noteVerificationExpiresAt?: Date;
}
