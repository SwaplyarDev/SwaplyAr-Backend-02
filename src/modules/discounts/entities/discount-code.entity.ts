import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserDiscount } from './user-discount.entity';

@Entity('discount_codes')
export class DiscountCode {
  @PrimaryGeneratedColumn('uuid', { name: 'discount_code_id' })
  id: string;

  @Column({ unique: true, name: 'code' })
  code: string;

  @Column('numeric', {
    precision: 15,
    scale: 2,
    name: 'value',

    transformer: {
      to: (value: number) => value,
      from: (value: string): number => Number(value),
    },
  })
  value: number;

  @Column({ name: 'currency_code' })
  currencyCode: string;

  @Column({ type: 'timestamp with time zone', name: 'valid_from' })
  validFrom: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.discountCode)
  userDiscounts: UserDiscount[];
}
