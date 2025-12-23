import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('dynamic_commissions')
@Unique(['fromPlatformId', 'toPlatformId'])
export class DynamicCommission {
  @PrimaryGeneratedColumn('uuid', { name: 'dynamic_commissions_id' })
  id: string;

  @Column({ name: 'from_platform_id', type: 'uuid' })
  fromPlatformId: string;

  @Column({ name: 'to_platform_id', type: 'uuid' })
  toPlatformId: string;

  @Column({ name: 'commission_rate', type: 'float' })
  commissionRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
