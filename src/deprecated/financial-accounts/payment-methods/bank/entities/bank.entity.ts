import { ChildEntity, Column } from 'typeorm';
import { PaymentMethod } from 'src/deprecated/financial-accounts/payment-methods/entities/payment-method.entity';

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
