import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Status } from '../../../enum/status.enum';
import { AdministracionMaster } from './administracion-master.entity';
import { User } from '@users/entities/user.entity';

@Entity('administracion_status_log')
export class AdministracionStatusLog {
  @PrimaryGeneratedColumn('uuid', { name: 'log_id' })
  id: string;

  @Column({ type: 'enum', enum: Status, name: 'status' })
  status: Status;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt: Date;

  @Column({ type: 'text', nullable: true, name: 'message' })
  message: string;

  @ManyToOne(() => User, (usr) => usr.adminStatusLog)
  @JoinColumn({ name: 'changed_by_admin_id' })
  changedByAdmin: User;

  @Column({ type: 'jsonb', nullable: true })
  additionalData: Record<string, any>;

  @ManyToOne(() => AdministracionMaster, (master: AdministracionMaster) => master.statusLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: AdministracionMaster;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
