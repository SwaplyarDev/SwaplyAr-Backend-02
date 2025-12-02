import { Transaction } from '@transactions/entities/transaction.entity';
import { User } from '@users/entities/user.entity';
import { PaymentPlatforms } from 'src/modules/payments/entities/payment-platforms.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('financial_accounts')
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'financial_account_id' })
  financialAccountId: string;

  @ManyToOne(() => PaymentPlatforms, (pmntPlatforms) => pmntPlatforms.financialAccount)
  @JoinColumn({ name: 'payment_platform_id' })
  paymentPlatform: PaymentPlatforms;

  @Column({ type: 'varchar', length: 30 })
  reference_type: string;

  @Column({ type: 'uuid', name: 'reference_id' })
  referenceId: string; // ID de la cuenta específica (p. ej. banco o wallet)

  @ManyToOne(() => User, (usr) => usr.financialAccount)
  @JoinColumn({ name: 'user_id' })
  user: User; // Usuario propietario

  @Column({ type: 'varchar', length: 20, name: 'owner_type' })
  ownerType: string; // Ejemplo: 'admin' //disponible para todos, endpoint que retorne todas las financial accoutnt

  @ManyToOne(() => User, (usr) => usr.financialAccountsCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.financialAccounts)
  transactions: Transaction[];
}
