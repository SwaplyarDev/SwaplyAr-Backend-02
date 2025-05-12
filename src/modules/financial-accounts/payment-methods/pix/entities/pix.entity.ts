import { ChildEntity, Column } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@ChildEntity('pix')
export class Pix extends PaymentMethod {
  @Column({ name: 'virtual_bank_id' })
  virtualBankId: string;

  @Column({ name: 'pix_key' })
  pixKey: string;

  @Column({ name: 'pix_value' })
  pixValue: string;

  @Column({ name: 'cpf' })
  cpf: string;
}
