import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Currency } from '../currencies/currencies.entity';

@Entity('countries')
export class Countries {
  @PrimaryGeneratedColumn('uuid', { name: 'country_id' })
  id: string;

  @Column({ type: 'char', length: 3, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'uuid', nullable: false, name: 'currency_id' })
  currencyId: string;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'currency_id' })
  defaultCurrency: Currency;

  @ManyToMany(() => Currency, (currency) => currency.countries)
  currencies: Currency[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;
}
