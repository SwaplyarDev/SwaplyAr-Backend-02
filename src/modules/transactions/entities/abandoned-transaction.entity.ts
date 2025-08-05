import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { customAlphabet } from 'nanoid';

const nanoidCustom = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  10,
);

@Entity('abandoned_transactions')
export class AbandonedTransaction {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  abandoned_transaction_id: string;

  @BeforeInsert()
  generateId() {
    this.abandoned_transaction_id = nanoidCustom();
  }

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
