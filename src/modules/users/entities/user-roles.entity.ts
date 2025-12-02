import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'role_id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
    name: 'code',
  })
  @Index({ unique: true })
  code: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'description',
  })
  description?: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
