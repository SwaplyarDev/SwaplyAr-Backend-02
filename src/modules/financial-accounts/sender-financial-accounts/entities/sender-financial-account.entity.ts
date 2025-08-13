import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';
import { Expose } from 'class-transformer';

@ChildEntity ('sender')

export class SenderFinancialAccount extends FinancialAccount {

  @OneToMany (() => Transaction, (transaction) => transaction.receiverAccount)
  transactions: Transaction [];
  
  @Column ({ name: 'created_by' })
  @Expose ()
  createdBy: string;

  @Column ({ name: 'phone_number' })
  @Expose ()
  declare phoneNumber: string;

}
