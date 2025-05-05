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
import { Transaction } from '@transactions/entities/transaction.entity';

@Entity('user_discounts')
export class UserDiscount {
  @PrimaryGeneratedColumn('uuid', { name: 'user_discount_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.discounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Transaction, { onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @OneToOne(() => DiscountCode, { onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'discount_code_id' })
  discountCode: DiscountCode;

  @Column({ name: 'is_used' })
  isUsed: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'used_at' })
  usedAt: Date;
}
