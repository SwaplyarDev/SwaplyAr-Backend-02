import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
  id: string;

  @Column({ name: 'platform_id' })
  platformId: string; // fk de la tabla plataform

  @OneToOne(() => FinancialAccount)
  financialAccount: FinancialAccount;
}
