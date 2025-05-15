import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_approved')
export class ApprovedEntity {
  @PrimaryGeneratedColumn({ name: 'approved_id' })
  approvedId: number;

  @Column({ name: 'swapliyar_send', type: 'varchar', nullable: true })
  swapliyarSend: string;

  @Column({ name: 'transaction_receipt', type: 'varchar', nullable: true })
  transactionReceipt: string;

  @Column({ name: 'approved_note', type: 'varchar', nullable: true })
  approvedNote: string;

  @OneToOne(() => AdminMasterEntity, (admin) => admin.approved)
  admin: AdminMasterEntity;
} 