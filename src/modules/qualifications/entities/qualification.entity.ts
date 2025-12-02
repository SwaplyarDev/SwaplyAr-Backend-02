import { Transaction } from '@transactions/entities/transaction.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('qualifications')
export class Qualification {
  @PrimaryGeneratedColumn({ name: 'qualifications_id' })
  id: string;

  @ManyToOne(() => Transaction, (trs) => trs.qualifications, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ type: 'int' })
  stars_amount: number;

  @Column({ type: 'varchar', nullable: true })
  note: string;
}
