import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity'; 

@ChildEntity('receiver_crypto')
export class ReceiverCrypto extends PaymentMethod  {


  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'network' })
  network: string;

  @Column({ name: 'wallet' })
  wallet: string;
}
