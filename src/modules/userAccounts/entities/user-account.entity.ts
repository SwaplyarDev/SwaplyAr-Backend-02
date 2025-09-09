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
  accountId: string;

  @Column({ name: 'account_name', nullable: true })
  accountName: string;

  @Column({ name: 'account_type', nullable: true })
  accountType: Platform;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
  })
  status: boolean;
}
