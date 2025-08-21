import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UserVerificationAttempt } from './user-verification-attempt.entity';

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

  @ManyToOne(() => User, (user) => user.verifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) //  fuerza a usar user_id como FK
  user: User;

  @OneToMany (() => UserVerificationAttempt, (attempt) => attempt.verification)
  attempts: UserVerificationAttempt [];

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
