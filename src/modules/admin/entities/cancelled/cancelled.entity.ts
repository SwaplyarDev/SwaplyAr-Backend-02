import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_cancelled')
export class CancelledEntity {
  @PrimaryGeneratedColumn({ name: 'cancelled_id' })
  cancelledId: number;

  @Column({ name: 'cause', type: 'varchar', nullable: true })
  cause: string;

  @Column({ name: 'transaction_SwaplyAr', type: 'varchar', nullable: true })
  transactionSwaplyAr: string;

  @Column({ name: 'transaction_receipt', type: 'varchar', nullable: true })
  transactionReceipt: string;

  @Column({ name: 'reason_note', type: 'varchar', nullable: true })
  reasonNote: string;

  @OneToOne(() => AdminMasterEntity, (admin) => admin.cancelled)
  admin: AdminMasterEntity;
} 