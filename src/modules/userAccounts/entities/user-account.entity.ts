import { Platform } from 'src/enum/platform.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_account')
export class UserAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'account_id' })
  account_id: string;

  @Column({ name: 'account_name' })
  accountName: string;

  @Column({ name: 'currency', length: 10 })
  currency: string;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'type_id' })
  typeId: Platform;

  @Column({ name: 'user_id' })
  userId: string;
}
