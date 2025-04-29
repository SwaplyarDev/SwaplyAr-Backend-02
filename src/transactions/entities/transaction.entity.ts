import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  id: string;
}
