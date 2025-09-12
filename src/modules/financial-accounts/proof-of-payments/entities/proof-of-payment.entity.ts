import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Index } from 'typeorm';

@Entity('proof_of_payments')
export class ProofOfPayment {
  @PrimaryGeneratedColumn('uuid', { name: 'payments_id' })
  id: string;

  @Column({ name: 'img_url' })
  imgUrl: string;

  @Column({ name: 'create_at' })
  createAt: Date;

  @Index('idx_proof_of_payments_transaction_id')
  @ManyToOne(() => Transaction, (trans) => trans.proofsOfPayment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
