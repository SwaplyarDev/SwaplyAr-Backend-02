import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_rewards')
export class RewardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ type: 'decimal', default: 0 })
  quantity: number;

  @Column({ default: 0 })
  stars: number;
}
