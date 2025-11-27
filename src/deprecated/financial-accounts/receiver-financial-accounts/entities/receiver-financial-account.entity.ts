import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, OneToMany } from 'typeorm';
import { FinancialAccount } from 'src/deprecated/financial-accounts/entities/financial-account.entity';

@ChildEntity('receiver')
export class ReceiverFinancialAccount extends FinancialAccount {
  @OneToMany(() => Transaction, (transaction) => transaction.receiverAccount)
  transactions: Transaction[];
}
