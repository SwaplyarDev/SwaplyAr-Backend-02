import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProofOfPayment {
  @PrimaryGeneratedColumn('uuid', { name: 'payments_id' })
  id: string;

  @Column({ name: 'img_transaction' })
  imgTransaction: string;

  @Column({ name: 'img_id' })
  imgId: string;

  @Column({ name: 'create_at' })
  createAt: Date;
}
