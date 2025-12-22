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
import { Transaction } from '@transactions/entities/transaction.entity';

@Entity('administracion_status_log')
export class AdministracionStatusLog {
  @PrimaryGeneratedColumn('uuid', { name: 'log_id' })
  id: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({
    name: 'additionalData',
    type: 'jsonb',
    nullable: true,
  })
  additionalData?: Record<string, any>;

  // 🔹 ADMIN MASTER (UUID)
  @ManyToOne(() => AdministracionMaster, (master) => master.statusLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'administracion_masters_id',
  })
  administracionMaster: AdministracionMaster;

  @ManyToOne(() => Transaction, (tx) => tx.administrationStatusLog)
  @JoinColumn({
    name: 'transaction_id',
    referencedColumnName: 'id',
  })
  transaction: Transaction;

  @ManyToOne(() => User, (usr) => usr.adminStatusLog)
  @JoinColumn({ name: 'changed_by_admin_id' })
  changedByAdmin: User;

  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;
}
