import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  role_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; 

  @Column({ type: 'varchar', length: 100 })
  name: string; 

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}