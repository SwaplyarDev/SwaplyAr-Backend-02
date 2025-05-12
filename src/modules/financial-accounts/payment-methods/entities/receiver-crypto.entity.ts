import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receiver_crypto')
export class ReceiverCrypto {
  @PrimaryGeneratedColumn('uuid', { name: 'receiver_crypto_id' })
  receiverCryptoId: string;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'network' })
  network: string;

  @Column({ name: 'wallet' })
  wallet: string;
}
