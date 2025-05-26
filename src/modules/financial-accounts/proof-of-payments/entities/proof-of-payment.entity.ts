import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProofOfPayment {
  @PrimaryGeneratedColumn('uuid', { name: 'payments_id' })
  id: string;

  @Column({ name: 'img_url' })
  imgUrl: string;

  @Column({ name: 'create_at' })
  createAt: Date;

  @OneToOne(() => Transaction, (trans) => trans.proofOfPayment)
  transaction: Transaction;
}
