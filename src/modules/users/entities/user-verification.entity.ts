import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  RESEND_DATA = 'resend-data', // nuevo estado para reenviar documentos o info
}

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  verification_id: string;

  @ManyToOne(() => User, (user) => user.verifications)
  user: User;

  @Column()
  users_id: string;

  @Column()
  document_front: string;

  @Column()
  document_back: string;

  @Column()
  selfie_image: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

  @Column({ nullable: true })
  note_rejection: string;

  @Column({ nullable: true })
  verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
