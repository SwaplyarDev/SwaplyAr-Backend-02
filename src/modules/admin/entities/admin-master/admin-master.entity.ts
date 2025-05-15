import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { StatusEntity } from '../status/status.entity';
import { RejectedEntity } from '../rejected/rejected.entity';
import { DiscrepancyEntity } from '../discrepancy/discrepancy.entity';
import { CancelledEntity } from '../cancelled/cancelled.entity';
import { ApprovedEntity } from '../approved/approved.entity';
import { LogEntity } from '../log/log.entity';
import { AdminUserEntity } from '../admin-user/admin-user.entity';
import { Transaction } from '../../../transactions/entities/transaction.entity';

@Entity('administracion_master')
export class AdminMasterEntity {
  @PrimaryGeneratedColumn({ name: 'adm_id' })
  admId: number;

  @ManyToOne(() => Transaction, { nullable: false })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusEntity;

  @Column({ type: 'date', name: 'begin_transaction' })
  beginTransaction: Date;

  @Column({ type: 'date', name: 'end_transaction', nullable: true })
  endTransaction: Date;

  @ManyToOne(() => AdminUserEntity)
  @JoinColumn({ name: 'administrative_id' })
  administrative: AdminUserEntity;

  @Column({ type: 'varchar', name: 'transfer_received', nullable: true })
  transferReceived: string;

  @OneToOne(() => RejectedEntity, (rej) => rej.admin, { nullable: true })
  @JoinColumn({ name: 'rejected_id' })
  rejected: RejectedEntity;

  @OneToOne(() => DiscrepancyEntity, (dis) => dis.admin, { nullable: true })
  @JoinColumn({ name: 'discrepancy_id' })
  discrepancy: DiscrepancyEntity;

  @OneToOne(() => CancelledEntity, (can) => can.admin, { nullable: true })
  @JoinColumn({ name: 'cancelled_id' })
  cancelled: CancelledEntity;

  @OneToOne(() => ApprovedEntity, (app) => app.admin, { nullable: true })
  @JoinColumn({ name: 'approved_id' })
  approved: ApprovedEntity;

  @OneToMany(() => LogEntity, (log) => log.admin)
  logs: LogEntity[];
} 