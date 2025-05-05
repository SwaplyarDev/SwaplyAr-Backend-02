import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { DiscountCode } from '@users/entities/discount-code.entity';

@Entity('user_discounts')
export class UserDiscount {
  @PrimaryGeneratedColumn('uuid', { name: 'user_discount_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.discounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // TODO: Add transaction
  // transaction

  @OneToOne(() => DiscountCode, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'discount_code_id' })
  discountCode: DiscountCode;

  @Column({ name: 'is_used' })
  isUsed: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'used_at' })
  usedAt: Date;
}
