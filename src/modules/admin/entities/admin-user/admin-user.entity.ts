import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AdminMasterEntity } from '../admin-master/admin-master.entity';

@Entity('dim_administrativos')
export class AdminUserEntity {
  @PrimaryGeneratedColumn({ name: 'administrativo_id' })
  administrativoId: number;

  @Column({ name: 'nombre_completo', type: 'varchar' })
  nombreCompleto: string;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({ name: 'apellido', type: 'varchar' })
  apellido: string;

  @Column({ name: 'hora_trabajo', type: 'date', nullable: true })
  horaTrabajo: Date;

  @Column({ name: 'hora_entrada', type: 'date', nullable: true })
  horaEntrada: Date;

  @Column({ name: 'hora_salida', type: 'date', nullable: true })
  horaSalida: Date;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone: string;

  @Column({ name: 'mail', type: 'varchar', nullable: true })
  mail: string;

  @Column({ name: 'DNI', type: 'varchar', nullable: true })
  dni: string;

  @Column({ name: 'fecha_contratacion', type: 'date', nullable: true })
  fechaContratacion: Date;

  @OneToMany(() => AdminMasterEntity, (admin) => admin.administrative)
  admins: AdminMasterEntity[];
} 