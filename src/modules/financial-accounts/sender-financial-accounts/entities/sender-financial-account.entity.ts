import { Transaction } from '@transactions/entities/transaction.entity';
import { ChildEntity, Column, OneToMany, Index } from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';
import { Expose } from 'class-transformer';

@ChildEntity('sender')
export class SenderFinancialAccount extends FinancialAccount {
  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  transactions: Transaction[];

  @Index('idx_sender_fin_accounts_created_by')
  @Column({ name: 'created_by' })
  @Expose()
  createdBy: string;

  @Index('idx_sender_fin_accounts_phone')
  @Column({ name: 'phone_number' })
  @Expose()
  phoneNumber: string;
}
