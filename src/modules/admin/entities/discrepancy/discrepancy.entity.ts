import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_discrepancy')
export class DiscrepancyEntity {
  @PrimaryGeneratedColumn({ name: 'discrepancy_id' })
  discrepancyId: number;

  @Column({ name: 'cause', type: 'varchar', nullable: true })
  cause: string;

  @Column({ name: 'result', type: 'varchar', nullable: true })
  result: string;

  @OneToOne(() => AdminMasterEntity, (admin) => admin.discrepancy)
  admin: AdminMasterEntity;
} 