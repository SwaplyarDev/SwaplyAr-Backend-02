import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_status')
export class StatusEntity {
  @PrimaryGeneratedColumn({ name: 'id_status' })
  id: number;

  @Column({ type: 'varchar', name: 'status' })
  status: string;

  @OneToMany(() => AdminMasterEntity, (admin) => admin.status)
  admins: AdminMasterEntity[];
} 