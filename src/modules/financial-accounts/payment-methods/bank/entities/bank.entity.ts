import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@ChildEntity('bank')
export class Bank extends PaymentMethod {
  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'send_method_key' })
  sendMethodKey: string;

  @Column({ name: 'send_method_value' })
  sendMethodValue: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ name: 'document_value' })
  documentValue: string;
}
