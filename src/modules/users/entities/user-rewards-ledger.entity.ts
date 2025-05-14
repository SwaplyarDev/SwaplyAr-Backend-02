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

  @Column({ name: 'stars_count', default: 0 })
  starsCount: number;

  @Column({ name: 'progress_amount', default: 0 })
  progressAmount: number;

  @Column({ name: 'times_granted', default: 0 })
  timesGranted: number;
}
