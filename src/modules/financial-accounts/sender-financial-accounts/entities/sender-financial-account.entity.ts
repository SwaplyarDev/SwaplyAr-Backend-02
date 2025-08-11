import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@ChildEntity('sender')
export class SenderFinancialAccount extends FinancialAccount {
  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];

  @Column({ name: 'created_by' })
  createdBy: string;
}
