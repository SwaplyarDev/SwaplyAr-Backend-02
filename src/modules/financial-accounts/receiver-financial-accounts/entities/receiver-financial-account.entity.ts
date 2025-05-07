import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(
    () => Transaction,
    () => (transaction) => transaction.receiverAccount,
  )
  transactions: Transaction[];
}
