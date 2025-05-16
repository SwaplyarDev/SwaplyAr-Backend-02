import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('otp_codes')
export class OtpCode {
  @PrimaryGeneratedColumn('uuid', { name: 'otp_code_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.otpCodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'expiry_date', type: 'timestamp with time zone' })
  expiryDate: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;
}
