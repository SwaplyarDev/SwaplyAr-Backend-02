import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DimStatus } from './dim-status.entity';
import { DimAdministrativos } from './dim-administrativos.entity';
import { DimRejected } from './dim-rejected.entity';
import { DimDiscrepancy } from './dim-discrepancy.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { DimCancelled } from './dim-cancelled.entity';
import { DimApproved } from './dim-approved.entity';

@Entity('admin_master')
export class AdminMaster {
  @PrimaryGeneratedColumn('uuid', { name: 'admin_id' })
  id: string;
s
  @OneToOne(() => DimStatus, (dimStatus) => dimStatus.id)
  @JoinColumn({name: 'status_id'})
  status: DimStatus;
  
  @OneToMany(() => DimRejected, (dimRejected) => dimRejected.id)
  @JoinColumn({ name: 'rejected_id' })
  rejected: DimRejected[];
  
  @OneToMany(() => DimDiscrepancy, (dimDiscrepancy) => dimDiscrepancy.id)
  @JoinColumn({ name: 'discrepancy_id' })
  discrepancy: DimDiscrepancy[];
  
  @OneToMany(() => DimCancelled, (dimCancelled) => dimCancelled.id)
  @JoinColumn({ name: 'dim_Cancelled' })
  cancelled: DimCancelled[];
  
  @OneToMany(() => DimApproved, (dimApproved) => dimApproved.id)
  @JoinColumn({ name: 'dim_Approved' })
  approved: DimApproved[];

  @OneToOne(() => DimAdministrativos,(dimAdministrativos) => dimAdministrativos.id)
  @JoinColumn({name: 'administrative_id'})
  administrative: DimAdministrativos;

  @ManyToMany(()=> Transaction)
  @JoinColumn({name: 'transaction_id'})
  transaction: Transaction[];
}
