import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { DiscountCode } from './discount-code.entity';
import { Transaction } from '@transactions/entities/transaction.entity';

@Entity('user_discounts')
export class UserDiscount {
  @PrimaryGeneratedColumn('uuid', { name: 'user_discount_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.discounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DiscountCode, (discountCode) => discountCode.userDiscounts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'discount_code_id' })
  discountCode: DiscountCode;

  @ManyToMany(() => Transaction, (transaction) => transaction.userDiscounts)
  transactions: Transaction[];

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', name: 'used_at', nullable: true })
  usedAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;
}
