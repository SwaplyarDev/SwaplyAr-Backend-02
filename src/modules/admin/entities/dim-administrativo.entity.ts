import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { AdministracionMaster } from './administracion-master.entity';

@Entity('dim_administrativos')
export class DimAdministrativo {
  @PrimaryGeneratedColumn('uuid', { name: 'administrativo_id' })
  id: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'work_hours', type: 'time', nullable: true })
  workHours: string;

  @Column({ name: 'entry_time', type: 'time', nullable: true })
  entryTime: string;

  @Column({ name: 'exit_time', type: 'time', nullable: true })
  exitTime: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'national_id', type: 'varchar', nullable: true })
  nationalId: string;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate: string;

  @OneToMany(() => AdministracionMaster, (master: AdministracionMaster) => master.administrativo)
  transactions: AdministracionMaster[];
} 