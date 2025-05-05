import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount_codes')
export class DiscountCode {
  @PrimaryGeneratedColumn('uuid', { name: 'discount_code_id' })
  id: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'value', type: 'integer' })
  value: number;

  @Column({ name: 'currency_code' })
  currencyCode: string;

  @Column({ name: 'valid_from' })
  validFrom: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
