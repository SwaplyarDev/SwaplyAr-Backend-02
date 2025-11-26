import { Transaction } from '@transactions/entities/transaction.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('proof_of_payments')
@Index('idx_proof_of_payments_tx_created_at', ['transaction', 'createAt'])
export class ProofOfPayment {
  @PrimaryGeneratedColumn('uuid', { name: 'payments_id' })
  id: string;

  @Column({ name: 'img_url' })
  imgUrl: string;

  @Index('idx_proof_of_payments_created_at')
  @CreateDateColumn({ name: 'create_at', type: 'timestamp' })
  createAt: Date;

  @Index('idx_proof_of_payments_transaction_id')
  @ManyToOne(() => Transaction, (trans) => trans.proofsOfPayment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
