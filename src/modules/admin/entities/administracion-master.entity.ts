import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminStatus } from '../../../enum/admin-status.enum';
import { Transaction } from '@transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './administracion-status-log.entity';
import { User } from '@users/entities/user.entity';

@Entity('administracion_master')
export class AdministracionMaster {
  @PrimaryColumn('uuid', { name: 'transaction_id' })
  transactionId: string;

  // Relación con la transacción original
  @OneToOne(() => Transaction, { eager: false })
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'id' })
  transaction: Transaction;

  // Relación con el usuario administrador
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'admin_user_id' })
  adminUser: User;

  @Column({ name: 'admin_user_id', type: 'uuid' })
  adminUserId: string;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.Pending,
  })
  status: AdminStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'begin_transaction', nullable: true })
  beginTransaction: Date;

  @Column({ type: 'timestamp', name: 'end_transaction', nullable: true })
  endTransaction: Date;

  @Column({ type: 'text', name: 'transfer_received', nullable: true })
  transferReceived: string;

  // Logs de estado asociados
  @OneToMany(
    () => AdministracionStatusLog,
    (log: AdministracionStatusLog) => log.transaction,
    {
      cascade: true
    }
  )
  statusLogs: AdministracionStatusLog[];
}
