

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('dynamic_commissions')
@Unique(['fromPlatform', 'toPlatform'])
export class DynamicCommission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_platform', type: 'varchar', length: 20 })
  fromPlatform: string;

  @Column({ name: 'to_platform', type: 'varchar', length: 20 })
  toPlatform: string;

  @Column({ name: 'commission_rate', type: 'float' })
  commissionRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}




