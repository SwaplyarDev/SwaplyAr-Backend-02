import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('amounts')
export class Amount {
  @PrimaryGeneratedColumn('uuid', { name: 'amount_id' })
  id: string;

  @Column('numeric', { name: 'amount_sent', precision: 15, scale: 2 })
  amountSent: number; // cantidad enviada

  @Column({ name: 'currency_sent', type: 'varchar', length: 3 })
  currencySent: string; // moneda enviada

  @Column('numeric', { name: 'amount_received', precision: 15, scale: 2 })
  amountReceived: number; // cantidad recibida

  @Column({ name: 'currency_received', type: 'varchar', length: 3 })
  currencyReceived: string; // moneda recibida

  @Column({ name: 'is_received' })
  isReceived: boolean; // recibido o no

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (trs) => trs.amount, { onDelete: 'SET NULL' })
  transaction: Transaction[];
}
