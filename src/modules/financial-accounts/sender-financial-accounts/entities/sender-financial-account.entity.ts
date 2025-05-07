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
export class SenderFinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'sender_accounts_id' })
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'identification_number' })
  identificationNumber: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'email' })
  email: string;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];

  //@Column()
  //payment_method_id:string; fk de payment method
  @OneToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}
