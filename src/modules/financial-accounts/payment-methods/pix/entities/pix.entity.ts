import { ChildEntity, Column, Index, Unique } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';

@ChildEntity('pix')
export class Pix extends PaymentMethod {
  @Index('idx_pix_id')
  @Column({ name: 'pix_id' })
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
