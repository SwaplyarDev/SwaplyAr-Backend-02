import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';

@Entity('user_rewards_ledger')
export class UserRewardsLedger {
  @PrimaryGeneratedColumn('uuid', { name: 'ledger_id' })
  id: string;

  @OneToOne(() => User, (user) => user.rewardsLedger)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  stars: number;

  // opcional: timestamp de última actualización
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
