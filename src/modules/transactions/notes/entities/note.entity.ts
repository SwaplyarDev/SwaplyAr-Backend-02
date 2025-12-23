// note.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction as TransactionEntity } from '@transactions/entities/transaction.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid', { name: 'note_id' })
  note_id: string;

  @Column({ type: 'varchar', name: 'message' })
  message: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.note)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @Column('text', { array: true, nullable: true, name: 'attachments' })
  attachments: string[];

  @Column({ type: 'varchar', name: 'section' })
  section: string;
}

/* notes [icon: note, color: orange] {
    note_id    varchar pk   // Identificador único de la nota
    img_url    varchar      // imagen del comprobante
    message    varchar      // Contenido del mensaje
    created_at timestamp   // Fecha de creación de la nota
  } */
