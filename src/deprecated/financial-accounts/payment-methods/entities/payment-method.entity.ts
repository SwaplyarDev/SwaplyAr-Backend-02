import { Platform } from 'src/enum/platform.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

@Entity('payment_methods')
@TableInheritance({ column: { type: 'varchar', name: 'method' } })
@Index('idx_payment_methods_platform_method', ['platformId', 'method'])
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
  id: string;

  @Column({ name: 'platform', type: 'enum', enum: Platform })
  platformId: Platform;

  @Index('idx_payment_methods_method')
  @Column({ length: 50 })
  method: string;

  @Column({ name: 'type', type: 'varchar', length: 50, nullable: true })
  type?: string | null;
}
