import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_verifications')
export class UserVerification {
  @PrimaryGeneratedColumn('uuid', { name: 'user_verification_id' })
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'document_front' })
  documentFront: string;

  @Column({ name: 'document_back' })
  documentBack: string;

  @Column({ name: 'selfie_image' })
  selfieImage: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    name: 'verification_status',
  })
  verificationStatus: 'pending' | 'verified' | 'rejected';

  @Column({ name: 'rejection_note' })
  rejectionNote: string;

  @Column({ name: 'verified_at', type: 'timestamp with time zone' })
  verifiedAt: Date;
}
