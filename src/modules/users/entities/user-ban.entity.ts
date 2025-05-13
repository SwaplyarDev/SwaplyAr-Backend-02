import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_bans')
export class UserBan {
  @PrimaryGeneratedColumn('uuid', { name: 'user_ban_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.bans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // TODO: Add Admin column
  // admin: Admin

  @Column({ name: 'reason' })
  reason: string;

  @Column({ name: 'start_date', type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp with time zone' })
  endDate: Date;

  @Column({ name: 'is_permanent' })
  isPermanent: boolean;

  @Column({ name: 'is_active' })
  isActive: boolean;
}
