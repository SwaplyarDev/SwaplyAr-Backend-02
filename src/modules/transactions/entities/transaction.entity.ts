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
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { customAlphabet } from 'nanoid';
import { Note } from '@transactions/notes/entities/note.entity';
import { Regret } from '@transactions/regrets/entities/regrets.entity';
import { UserDiscount } from '@discounts/entities/user-discount.entity';
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

  @Index('idx_transactions_country_transaction')
  @Column({ name: 'country_transaction' })
  countryTransaction: string;

  @Column({ name: 'message', nullable: true })
  message: string;

  @Index('idx_transactions_created_at')
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Index('idx_transactions_final_status')
  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.Pending,
    name: 'final_status',
  })
  finalStatus: AdminStatus;

  @Index('idx_transactions_sender_account_id')
  @ManyToOne(() => SenderFinancialAccount, (sender) => sender.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount: SenderFinancialAccount;

  @Index('idx_transactions_receiver_account_id')
  @ManyToOne(() => ReceiverFinancialAccount, (receiver) => receiver.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount: ReceiverFinancialAccount;

  // Mantener OneToOne pero opcional y sin obligar existencia
  @OneToOne(() => Note, (note) => note.transaction, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'note_id' })
  note?: Note | null;

  @OneToOne(() => Regret, (regret) => regret.transaction, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'regret_id' })
  regret?: Regret | null;

  // Cambiar a OneToMany (una transacción puede tener varios comprobantes)
  @OneToMany(() => ProofOfPayment, (proof) => proof.transaction, { cascade: true })
  proofsOfPayment?: ProofOfPayment[];

  // Mantener relación con Amount, pero agregar columnas desnormalizadas para consultas rápidas
  @OneToOne(() => Amount)
  @JoinColumn({ name: 'amount_id' })
  amount: Amount;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'amount_value', nullable: true })
  amountValue?: string;

  @Column({ type: 'varchar', length: 3, name: 'amount_currency', nullable: true })
  amountCurrency?: string;

  @ManyToMany(() => UserDiscount, (ud) => ud.transactions)
  @JoinTable({
    name: 'transaction_user_discounts',
    joinColumn: { name: 'transaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_discount_id', referencedColumnName: 'id' },
  })
  userDiscounts: UserDiscount[];

  @Column({ default: false })
  isNoteVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  noteVerificationExpiresAt?: Date;
}
