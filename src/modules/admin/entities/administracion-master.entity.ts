import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AdminStatus } from './admin-status.enum';
import { DimAdministrativo } from './dim-administrativo.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './administracion-status-log.entity';

@Entity('administracion_master')
export class AdministracionMaster {
  @PrimaryColumn('uuid', { name: 'transaction_id' })
  id: string;

  // Relación con la transacción original
  @OneToOne(() => Transaction, { eager: false })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  // Relación con el administrador responsable
  @ManyToOne(
    () => DimAdministrativo,
    (admin: DimAdministrativo) => admin.transactions,
    {
      eager: false,
    },
  )
  @JoinColumn({ name: 'administrativo_id' })
  administrativo: DimAdministrativo;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.Pending,
  })
  status: AdminStatus;

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
  )
  statusLogs: AdministracionStatusLog[];
}
