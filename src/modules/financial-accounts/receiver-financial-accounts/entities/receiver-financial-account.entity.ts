import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@ChildEntity ('receiver')

export class ReceiverFinancialAccount extends FinancialAccount {

  @OneToMany (() => Transaction, (transaction) => transaction.receiverAccount)

  transactions: Transaction [];

}
