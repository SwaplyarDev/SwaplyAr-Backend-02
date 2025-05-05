import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_rewards_ledgers')
export class UserRewardsLedger {
  @PrimaryGeneratedColumn('uuid', { name: 'user_rewards_ledger_id' })
  id: string;

  @Column({ name: 'stars_count' })
  starsCount: number;

  @Column({ name: 'progress_amount' })
  progressAmount: number;

  @Column({ name: 'times_granted' })
  timesGranted: number;
}
