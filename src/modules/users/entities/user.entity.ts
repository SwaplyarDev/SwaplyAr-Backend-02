import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserAlternativeEmail } from '@users/entities/user-alternative-email.entity';
import { UserLocation } from '@users/entities/user-location.entity';
import { UserContact } from '@users/entities/user-contact.entity';
import { UserQuestion } from '@users/entities/user-question.entity';
import { UserBan } from '@users/entities/user-ban.entity';
import { UserVerification } from '@users/entities/user-verification.entity';
import { RefreshToken } from '@users/entities/resfresh-token.entity';
import { Exclude } from 'class-transformer';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UserAccount } from 'src/modules/userAccounts/entities/user-account.entity';
import { UserDiscount } from 'src/modules/discounts/entities/user-discount.entity';
import { UserRewardsLedger } from 'src/modules/discounts/entities/user-rewards-ledger.entity';
import { customAlphabet } from 'nanoid';
import { BankAccounts } from 'src/modules/payments/entities/bank-accounts.entity';
import { VirtualBankAccounts } from 'src/modules/payments/entities/payment-virtual-bank-accounts.entity';
import { CryptoAccounts } from 'src/modules/payments/entities/crypto-accounts.entity';

export const nanoidCustom = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8,
);

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

  @OneToMany(() => BankAccounts, (bankAccount) => bankAccount.user)
  bank_accounts: BankAccounts[];

  @OneToMany(() => VirtualBankAccounts, (virtualBankAccount) => virtualBankAccount.user)
  virtual_bank_accounts: VirtualBankAccounts[];

  @OneToMany(() => CryptoAccounts, (cryptoAccount) => cryptoAccount.user)
  crypto_accounts: CryptoAccounts[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
    name: 'user_role',
  })
  role: UserRole;

  @Column({ name: 'terms_accepted', default: false })
  termsAccepted: boolean;

  @BeforeInsert()
  generateMemberCode() {
    this.memberCode = nanoidCustom(); // genera un string de 8 caracteres sin "-" ni "_"
  }

  @Column({
    name: 'member_code',
    type: 'varchar',
    length: 8,
    nullable: false,
    unique: true,
  })
  memberCode: string;

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
