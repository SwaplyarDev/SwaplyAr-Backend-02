import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity'; // ajusta la ruta según tu estructura

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  role_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; // Ej: 'user', 'admin', 'super_admin'

  @Column({ type: 'varchar', length: 100 })
  name: string; // Ej: 'Usuario', 'Administrador', etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Si quieres relacionarlo con los usuarios
  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}