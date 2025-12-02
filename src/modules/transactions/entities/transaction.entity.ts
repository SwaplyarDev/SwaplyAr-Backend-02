import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { SenderFinancialAccount } from 'src/modules/sender-accounts/entities/sender-financial-account.entity';
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
} from 'typeorm';

import { customAlphabet } from 'nanoid';
import { Note } from '@transactions/notes/entities/note.entity';
import { Regret } from '@transactions/regrets/entities/regrets.entity';
import { Status } from 'src/enum/status.enum';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';
import { IsOptional } from 'class-validator';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { TransactionUserDiscounts } from './transaction-user-discounts.entity';
import { Qualification } from 'src/modules/qualifications/entities/qualification.entity';
import { AdministracionMaster } from '@admin/entities/administracion-master.entity';

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
  @IsOptional()
  message: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending,
    name: 'final_status',
  })
  finalStatus: Status;

  @Column({ name: 'is_note_verified', default: false })
  isNoteVerified: boolean;

  @Column({ name: 'note_verification_expires_at', type: 'timestamp', nullable: true })
  noteVerificationExpiresAt?: Date;

  @Index('idx_transactions_sender_account_id')
  @ManyToOne(() => SenderFinancialAccount, (sender) => sender.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sender_account' })
  senderAccount: SenderFinancialAccount;

  @ManyToOne(() => FinancialAccount, (financial) => financial.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'financial_accounts' })
  financialAccounts: FinancialAccount;

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

  @OneToMany(() => AdministracionStatusLog, (adminStatusLog) => adminStatusLog.transaction, {
    cascade: true,
  })
  administrationStatusLog?: AdministracionStatusLog[];

  @OneToMany(
    () => TransactionUserDiscounts,
    (transactionUserDiscounts) => transactionUserDiscounts.transaction,
    { cascade: true },
  )
  transactionUserDiscounts: TransactionUserDiscounts[];

  @OneToMany(() => Qualification, (qualification) => qualification.transaction, {
    cascade: true,
  })
  qualifications: Qualification[];

  @OneToMany(() => AdministracionMaster, (adminMaster) => adminMaster.transaction, {
    cascade: true,
  })
  administrationMasters: AdministracionMaster[];

  // Mantener relación con Amount, pero agregar columnas desnormalizadas para consultas rápidas
  @ManyToOne(() => Amount, (amt) => amt.transaction)
  @JoinColumn({ name: 'amount_id' })
  amount: Amount;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'amount_value', nullable: true })
  amountValue?: string;

  @Column({ type: 'varchar', length: 3, name: 'amount_currency', nullable: true })
  amountCurrency?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
