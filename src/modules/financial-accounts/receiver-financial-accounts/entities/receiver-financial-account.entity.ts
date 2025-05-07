import { Transaction } from '@transactions/entities/transaction.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@Entity()
export class ReceiverFinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'receiver_accounts_id' })
  id: string;
  //@Column()
  //payment_method_id: string; fk de payment method
  @Column({ name: 'first_name' })
  firstName: string;
  @Column({ name: 'last_name' })
  lastName: string;

  @OneToMany(() => Transaction, (transaction) => transaction.receiverAccount)
  transactions: Transaction[];

  @OneToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}
