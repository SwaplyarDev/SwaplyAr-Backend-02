import { PaymentPlatforms } from "src/modules/payments/payment-platforms/entities/payment-platforms.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('dynamic_commissions')
@Unique(['fromPlatform', 'toPlatform'])
export class DynamicCommission {
  @PrimaryGeneratedColumn('uuid', { name: 'dynamic_commissions_id' })
  id: string;

  @ManyToOne(() => PaymentPlatforms, (pmntPlatform) => pmntPlatform.fromComission)
  @JoinColumn({ name: 'from_platform_id' })
  fromPlatform: string;

  @ManyToOne(() => PaymentPlatforms, (pmntPlatform) => pmntPlatform.toComission)
  @JoinColumn({ name: 'to_platform_id' })
  toPlatform: string;

  @Column({ name: 'commission_rate', type: 'float' })
  commissionRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
