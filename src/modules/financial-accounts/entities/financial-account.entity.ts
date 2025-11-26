import { Transaction } from '@transactions/entities/transaction.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('financial_accounts')
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  financialAccountId: string;

  @Column({
    type: 'uuid',
    name: 'payment_platform_id',
  })
  paymentPlatformId: string; // FK → payment_platforms (bank, virtual_bank, receiver_crypto)

  @Column({ type: 'uuid', name: 'reference_id' })
  referenceId: string; // ID de la cuenta específica (p. ej. banco o wallet)

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string; // Usuario propietario

  @Column({ type: 'varchar', length: 20, name: 'owner_type' })
  ownerType: string; // Ejemplo: 'admin'

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string; // ID del usuario que crea el registro

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.financialAccounts)
  transactions: Transaction[];
}
