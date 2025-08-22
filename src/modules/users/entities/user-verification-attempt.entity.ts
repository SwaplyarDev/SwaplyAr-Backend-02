

import {

  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserVerification } from './user-verification.entity';

@Entity ('user_verification_attempts')

export class UserVerificationAttempt {

  @PrimaryGeneratedColumn ('uuid')
  attempt_id: string;

  @Column ()
  verification_id: string;

  @Column ()
  document_front: string;

  @Column ()
  document_back: string;

  @Column ()
  selfie_image: string;

  @CreateDateColumn ()
  created_at: Date;

  @ManyToOne (() => UserVerification, (verification) => verification.attempts, {

    onDelete: 'CASCADE',

  })

  @JoinColumn ({ name: 'verification_id' })
  verification: UserVerification;
  
}

