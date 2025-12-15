import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../../enum/status.enum';
import { Transaction } from '@transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './administracion-status-log.entity';
import { User } from '@users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('administracion_masters')
export class AdministracionMaster {
  @PrimaryColumn({ name: 'administracion_masters_id' })
  administacionMastersId: string;

  // Relación con la transacción original
  @ManyToOne(() => Transaction, (trs) => trs.administrationMasters)
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'id' })
  @ApiHideProperty()
  transaction: Transaction;

  // Relación con el usuario administrador
  @ManyToOne(() => User, (usr) => usr.a)
  @JoinColumn({ name: 'user_id' })
  adminUser: User;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.Pending,
  })
  status: Status;

  // Logs de estado asociados
  @OneToMany(() => AdministracionStatusLog, (log: AdministracionStatusLog) => log.transaction)
  statusLogs: AdministracionStatusLog[];

  @Column({ type: 'timestamp', name: 'begin_transaction', nullable: true })
  beginTransaction: Date;

  @Column({ type: 'timestamp', name: 'end_transaction', nullable: true })
  endTransaction: Date;

  @Column({ type: 'text', name: 'transfer_received', nullable: true })
  transferReceived: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
