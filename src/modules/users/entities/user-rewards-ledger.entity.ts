import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_rewards_ledgers')
export class UserRewardsLedger {
  @PrimaryGeneratedColumn('uuid', { name: 'user_rewards_ledger_id' })
  id: string;

  @OneToOne(() => User, (user) => user.rewardsLedger, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'stars_count' })
  starsCount: number;

  @Column({ name: 'progress_amount' })
  progressAmount: number;

  @Column({ name: 'times_granted' })
  timesGranted: number;
}
