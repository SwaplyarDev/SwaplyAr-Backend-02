import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Amount {
  @PrimaryGeneratedColumn('uuid', { name: 'amount_id' })
  id: string;

  @Column('numeric', { precision: 15, scale: 2 })
  amountSent: number; // cantidad enviada

  @Column()
  currencySent: string; // moneda enviada

  @Column('numeric', { precision: 15, scale: 2 })
  amountReceived: number; // cantidad recibida

  @Column()
  currencyReceived: string; // moneda recibida

  @Column()
  received: boolean; // recibido o no
}
