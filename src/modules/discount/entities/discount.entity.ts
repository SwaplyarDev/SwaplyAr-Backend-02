import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('discount_codes')
export class DiscountEntity {
  @PrimaryGeneratedColumn('uuid')
  code_id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  discount_value: string;

  @Column()
  currency_code: string;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @CreateDateColumn()
  created_at: Date;
}
