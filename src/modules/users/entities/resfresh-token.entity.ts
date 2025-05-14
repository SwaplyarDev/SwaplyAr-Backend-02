import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { name: 'refresh_token_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expiry_date', type: 'timestamp with time zone' })
  expiryDate: Date;
}
