import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_log')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AdminMasterEntity, (admin) => admin.logs)
  admin: AdminMasterEntity;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @Column({ name: 'changed_in', type: 'date' })
  changedIn: Date;
} 