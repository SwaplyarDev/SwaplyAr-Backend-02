import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { PaymentProviders } from './providers.entity';

@Entity('payment_platforms')
export class PaymentPlatforms {
  @PrimaryGeneratedColumn('uuid')
  payment_platform_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @OneToMany(() => PaymentProviders, (payment_provider) => payment_provider.payment_platform)
  providers: PaymentProviders[];
}
