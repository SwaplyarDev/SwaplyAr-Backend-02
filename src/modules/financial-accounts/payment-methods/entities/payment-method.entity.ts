import { Platform } from 'src/enum/platform.enum';
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity('payment_methods')
@TableInheritance({ column: { type: 'varchar', name: 'method' } })
@Index(['platformId', 'method'])
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
  id: string;

  @Column({ name: 'platform', type: 'enum', enum: Platform })
  platformId: Platform;

  @Column()
  method: string;
}
