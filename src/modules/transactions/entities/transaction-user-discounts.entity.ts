import { Column, Entity, ManyToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserDiscount } from 'src/modules/discounts/entities/user-discount.entity';

@Entity('transaction_user_discounts')
export class TransactionUserDiscounts {
  @Column({
    type: 'uuid',
    name: 'transaction_id',
  })
  transactionId: string;

  @Column({
    type: 'varchar',
    name: 'user_discount_id',
  })
  userDiscountId: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionUserDiscounts)
  transaction: Transaction;

  @ManyToOne(() => UserDiscount, (userDiscount) => userDiscount.transactionUserDiscounts)
  userDiscount: UserDiscount;
}
