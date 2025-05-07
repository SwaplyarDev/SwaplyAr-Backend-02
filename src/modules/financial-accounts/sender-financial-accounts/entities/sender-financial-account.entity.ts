import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@ChildEntity('sender')
export class SenderFinancialAccount extends FinancialAccount {
  @Column({ name: 'identification_number' })
  identificationNumber: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'email' })
  email: string;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];
}
