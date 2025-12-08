import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Currency } from '../currencies/currencies.entity';

@Entity('countries')
export class Countries {
  @PrimaryGeneratedColumn('uuid')
  country_id: string;

  @Column({ type: 'char', length: 3, unique: true })
  code: string; // ISO 3166 (ARG, BRA, CHL…)

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency_default: string;

  @ManyToMany(() => Currency, (currency) => currency.countries)
  currencies: Currency[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  created_at: Date;
}
