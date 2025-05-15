import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_rejected')
export class RejectedEntity {
  @PrimaryGeneratedColumn({ name: 'rejected_id' })
  rejectedId: number;

  @Column({ name: 'note', type: 'varchar', nullable: true })
  note: string;

  @OneToOne(() => AdminMasterEntity, (admin) => admin.rejected)
  admin: AdminMasterEntity;
} 