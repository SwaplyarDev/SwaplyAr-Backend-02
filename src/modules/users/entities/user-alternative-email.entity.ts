import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_alternative_emails')
export class UserAlternativeEmail {
  @PrimaryGeneratedColumn('uuid', { name: 'user_alternative_email_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.alternativeEmails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'alternative_email' })
  alternativeEmail: string;
}
