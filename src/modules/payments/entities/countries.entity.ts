import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('countries')
export class Countries {
  @PrimaryGeneratedColumn('uuid')
  country_id: string;

  @Column({ type: 'char', length: 3, unique: true })
  code: string; // ISO 3166 (ej: ARG, BRA, CHL, VEN)

  @Column({ type: 'varchar', length: 100 })
  name: string; // Nombre del país

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency_default: string; // Moneda local (ARS, BRL, CLP, VES, etc.)

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date; // Fecha de registro
}
