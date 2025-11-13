import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';
import { IsOptional } from 'class-validator';

@Entity('financial_accounts')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Index(['paymentMethod'])
@Index('idx_financial_accounts_name', ['lastName', 'firstName'])
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  id: string;

  @Index('idx_financial_accounts_first_name')
  @Column({ name: 'first_name' })
  @IsOptional()
  firstName: string;

  @Index('idx_financial_accounts_last_name')
  @Column({ name: 'last_name' })
  @IsOptional()
  lastName: string;

  @OneToOne(() => PaymentMethod, {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}