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
import { Exclude } from 'class-transformer';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { UserRole } from 'src/enum/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Exclude()
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  profile: UserProfile;

  @Exclude()
  @OneToMany(() => UserAlternativeEmail, (userEmail) => userEmail.user, {
    cascade: true,
  })
  alternativeEmails: UserAlternativeEmail[];

  @Exclude()
  @OneToMany(() => UserLocation, (userLocation) => userLocation.user, {
    cascade: true,
  })
  locations: UserLocation[];

  @Exclude()
  @OneToMany(() => UserContact, (userContact) => userContact.user, {
    cascade: true,
  })
  contacts: UserContact[];

  @Exclude()
  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.user, {
    cascade: true,
  })
  discounts: UserDiscount[];

  @Exclude()
  @OneToMany(() => UserQuestion, (userQuestion) => userQuestion.user, {
    cascade: true,
  })
  questions: UserQuestion[];

  @Exclude()
  @OneToMany(() => UserBan, (userBan) => userBan.user, { cascade: true })
  bans: UserBan[];

  @Exclude()
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @Exclude()
  @OneToMany(() => UserVerification, (userVerification) => userVerification.user)
  verifications: UserVerification[];

  @Exclude()
  @OneToMany(() => OtpCode, (otpCode) => otpCode.user)
  otpCodes: OtpCode[];

  @Exclude()
  @OneToOne(() => UserRewardsLedger, (rewardsLedger) => rewardsLedger.user, {
    cascade: true,
  })
  rewardsLedger: UserRewardsLedger;

  /*@Column({
    type: 'enum',
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
    name: 'user_role',
  })
  role: 'user' | 'admin' | 'super_admin';*/

  
  //AGREGADO PARA LA TAREA
  @Column ({

  type: 'enum',
  enum: UserRole,
  default: UserRole.User,
  name: 'user_role',

  })
  role: UserRole;

  @Column({ name: 'terms_accepted', default: false })
  termsAccepted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    name: 'validated_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  validatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_validated', default: false })
  isValidated: boolean;

  @Column({ name: 'user_validated', default: false })
  userValidated: boolean;

  @Column({ nullable: true })
  refreshToken?: string;
}
