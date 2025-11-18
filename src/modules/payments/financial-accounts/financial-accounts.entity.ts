import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';

@Entity('financial_account')
export class FinancialAccounts {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  financialAccountId: string;

  @ManyToOne(
    () => PaymentPlatforms,
    (platform) => platform.financialAccounts,
    { nullable: false }
  )
  @JoinColumn({ name: 'payment_platform_id' }) // FK real
  payment_platform: PaymentPlatforms;

  @Column({ type: 'uuid', name: 'reference_id' })
  referenceId: string; // ID de la cuenta específica (p. ej. banco o wallet)

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; // Usuario propietario


  @Column({ type: 'varchar', length: 20, name: 'owner_type' })
  ownerType: string; // Ejemplo: 'admin'

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string; // ID del usuario que crea el registro

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
