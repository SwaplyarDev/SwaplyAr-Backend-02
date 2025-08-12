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
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  id: string;

  @Column({ name: 'first_name' })
  @IsOptional()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsOptional()
  lastName: string;

  @OneToOne(() => PaymentMethod, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}
