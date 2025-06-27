import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AdminStatus } from '../../../enum/admin-status.enum';
import { AdministracionMaster } from './administracion-master.entity';
import { User } from '@users/entities/user.entity';

@Entity('administracion_status_log')
export class AdministracionStatusLog {
  @PrimaryGeneratedColumn('uuid', { name: 'log_id' })
  id: string;

  @ManyToOne(
    () => AdministracionMaster,
    (master: AdministracionMaster) => master.statusLogs,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: AdministracionMaster;

  @Column({ type: 'enum', enum: AdminStatus })
  status: AdminStatus;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt: Date;

  @Column({ type: 'text', nullable: true })
  message: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'changed_by_admin_id' })
  changedByAdmin: User;

  @Column({ name: 'changed_by_admin_id', type: 'uuid' })
  changedByAdminId: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalData: Record<string, any>;
}
