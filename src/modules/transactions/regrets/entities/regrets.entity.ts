import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Transaction,
} from 'typeorm';
import { Transaction as TransactionEntity } from '@transactions/entities/transaction.entity';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';

@Entity('regrets')
export class Regret {
  @PrimaryGeneratedColumn('uuid', { name: 'regret_id' })
  id: string;

  @Column ({ type: 'varchar', name: 'transaction_id' })
  transaction_id: string;

  @Column({ type: 'varchar', name: 'last_name' })
  last_name: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone_number' })
  phone_number: string;

  @Column({ type: 'varchar', name: 'description' })
  description: string;

  //FK -> transaction_payment_info.payment_info_id  //relations
  // @Column({ type: 'varchar', name: 'payment_info_id' })
  // payment_info_id: string;

  //onetoone ?
  @OneToOne(() => TransactionEntity, (transaction) => transaction.regret)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @OneToOne(() => ProofOfPayment)
  @JoinColumn({ name: 'payment_info_id' })
  proofOfPayment: ProofOfPayment;
}

/* regrets [icon: x-circle, color: orange] {
    regret_id       varchar pk   // Identificador único del reclamo/regret
    last_name       varchar      // Apellido del usuario (posible contacto de reclamo)
    email           varchar      // Email de contacto
    phone_number    varchar      // Teléfono de contacto
    description     varchar      // Descripción del reclamo
    payment_info_id varchar      // FK -> transaction_payment_info.payment_info_id
  } */
