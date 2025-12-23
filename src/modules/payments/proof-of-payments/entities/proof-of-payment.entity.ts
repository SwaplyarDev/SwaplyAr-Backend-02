import { ApiHideProperty } from '@nestjs/swagger';
import { Transaction } from '@transactions/entities/transaction.entity';
import { Regret } from '@transactions/regrets/entities/regrets.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('proof_of_payments')
@Index('idx_proof_of_payments_tx_created_at', ['transaction', 'createdAt'])
export class ProofOfPayment {
  @PrimaryGeneratedColumn('uuid', { name: 'payments_id' })
  id: string;

  @Column({ name: 'img_url' })
  imgUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Transaction, (trans) => trans.proofsOfPayment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  @ApiHideProperty()
  transaction: Transaction;

  @OneToMany(() => Regret, (reg) => reg.proofsOfPayment, { onDelete: 'CASCADE' })
  regrets: Regret[];
  proof: Transaction[];
}
