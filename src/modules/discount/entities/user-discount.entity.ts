import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('user_discounts')
export class UserDiscountEntity {
  @PrimaryGeneratedColumn('uuid')
  user_discounts_id: string;

  @Column()
  code_id: string;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  transactions_id: string;

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  used_at: Date;
}
