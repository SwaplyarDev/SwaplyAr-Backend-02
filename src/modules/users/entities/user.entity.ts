import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserAlternativeEmail } from '@users/entities/user-alternative-email.entity';
import { UserLocation } from '@users/entities/user-location.entity';
import { UserContact } from '@users/entities/user-contact.entity';
import { UserQuestion } from '@users/entities/user-question.entity';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';
import { UserBan } from '@users/entities/user-ban.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { UserVerification } from '@users/entities/user-verification.entity';
import { RefreshToken } from '@users/entities/resfresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  profile: UserProfile;

  @OneToMany(() => UserAlternativeEmail, (userEmail) => userEmail.user, {
    cascade: true,
  })
  alternativeEmails: UserAlternativeEmail[];

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user, {
    cascade: true,
  })
  locations: UserLocation[];

  @OneToMany(() => UserContact, (userContact) => userContact.user, {
    cascade: true,
  })
  contacts: UserContact[];

  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.user, {
    cascade: true,
  })
  discounts: UserDiscount[];

  @OneToMany(() => UserQuestion, (userQuestion) => userQuestion.user, {
    cascade: true,
  })
  questions: UserQuestion[];

  @OneToMany(() => UserBan, (userBan) => userBan.user, { cascade: true })
  bans: UserBan[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(
    () => UserVerification,
    (userVerification) => userVerification.user,
  )
  verifications: UserVerification[];

  @OneToOne(() => UserRewardsLedger, (rewardsLedger) => rewardsLedger.user, {
    cascade: true,
  })
  rewardsLedger: UserRewardsLedger;

  @Column({
    type: 'enum',
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
    name: 'user_role',
  })
  role: 'user' | 'admin' | 'super_admin';

  @Column({ name: 'terms_accepted' })
  termsAccepted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    name: 'validated_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  validatedAt: Date;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_validated' })
  isValidated: boolean;
}
