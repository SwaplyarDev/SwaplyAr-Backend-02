import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserDiscount } from 'src/modules/discounts/entities/user-discount.entity';

@Entity('transaction_user_discounts')
export class TransactionUserDiscounts {
  @PrimaryColumn({ name: 'transaction_id', type: 'varchar', length: 10 })
  transactionId: string;

  @PrimaryColumn({ name: 'user_discount_id', type: 'uuid' })
  userDiscountId: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionUserDiscounts, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @ManyToOne(() => UserDiscount, (userDiscount) => userDiscount.transactionUserDiscounts)
  @JoinColumn({ name: 'user_discount_id' })
  userDiscount: UserDiscount;
}
