import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_contacts')
export class UserContact {
  @PrimaryGeneratedColumn('uuid', { name: 'user_contact_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.contacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'message' })
  message: string;
}
