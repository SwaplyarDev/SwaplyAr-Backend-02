import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminStatus } from '../../../enum/admin-status.enum';
import { AdministracionMaster } from './administracion-master.entity';

@Entity('administracion_status_log')
export class AdministracionStatusLog {
  @PrimaryGeneratedColumn('increment', { name: 'log_id' })
  id: number;

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

  @Column({
    type: 'timestamp',
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt: Date;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', nullable: true })
  cause: string;

  @Column({ type: 'boolean', nullable: true })
  result: boolean;

  @Column({ type: 'text', name: 'transaction_swaplyar', nullable: true })
  transactionSwaplyar: string;

  @Column({ type: 'text', name: 'transaction_receipt', nullable: true })
  transactionReceipt: string;

  @Column({ type: 'text', name: 'approved_note', nullable: true })
  approvedNote: string;
}
