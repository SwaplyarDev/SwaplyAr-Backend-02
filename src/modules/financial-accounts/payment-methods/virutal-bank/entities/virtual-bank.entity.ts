import { ChildEntity, Column } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@ChildEntity('virtual_bank')
export class VirtualBank extends PaymentMethod {
  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'email_account' })
  emailAccount: string;

  @Column({ name: 'transfer_code', nullable: true })
  transferCode?: string;
}
