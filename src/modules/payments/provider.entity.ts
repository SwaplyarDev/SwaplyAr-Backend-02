import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Platform } from './platform.entity';
import { Account } from './account.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country_code: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => Platform, (platform) => platform.providers)
  platform: Platform;

  @OneToMany(() => Account, (account) => account.provider)
  accounts: Account[];
}
