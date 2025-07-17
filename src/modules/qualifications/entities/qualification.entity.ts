import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qualifications')
export class Qualification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transaction_id: string;

  @Column({ type: 'int' })
  stars_amount: number;

  @Column({ nullable: true })
  note: string;
}
