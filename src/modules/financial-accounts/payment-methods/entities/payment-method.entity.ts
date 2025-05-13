import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  ViewColumn,
} from 'typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'method' } })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
  id: string;

  @Column({ name: 'platform_id' })
  platformId: string; // fk de la tabla platform falta hacer la relación

  @Column()
  method: string; // Exponer el campo discriminador
}
