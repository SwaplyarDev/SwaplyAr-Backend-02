import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Countries } from '../countries/countries.entity';

@Entity({ name: 'currencies' })
@Unique(['code'])
export class Currency {
  @PrimaryGeneratedColumn('uuid', { name: 'currency_id' })
  currencyId: string;

  @Column({ type: 'varchar', length: 10 })
  code: string; // ISO 4217 (USD, EUR, BRL)

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  symbol: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToMany(() => Countries, (country) => country.currencies)
  @JoinTable({
    name: 'countries_currencies',
    joinColumn: {
      name: 'currency_id',
      referencedColumnName: 'currencyId',
    },
    inverseJoinColumn: {
      name: 'country_id',
      referencedColumnName: 'country_id',
    },
  })
  countries: Countries[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
