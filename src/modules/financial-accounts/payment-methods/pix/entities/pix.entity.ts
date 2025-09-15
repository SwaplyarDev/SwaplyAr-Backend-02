import { ChildEntity, Column, Index, Unique } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@ChildEntity('pix')
@Unique('uq_pix_pix_key', ['pixKey'])
export class Pix extends PaymentMethod {
  @Index('idx_pix_virtual_bank_id')
  @Column({ name: 'virtual_bank_id' })
  pixId: string;

  @Index('idx_pix_key')
  @Column({ name: 'pix_key' })
  pixKey: string;

  @Column({ name: 'pix_value' })
  pixValue: string;

  @Index('idx_pix_cpf')
  @Column({ name: 'cpf', length: 14 })
  cpf: string;
}
