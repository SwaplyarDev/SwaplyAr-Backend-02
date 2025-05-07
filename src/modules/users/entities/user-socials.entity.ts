import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';

@Entity('user_socials')
export class UserSocials {
  @PrimaryGeneratedColumn('uuid', { name: 'user_socials_id' })
  id: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.socials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfile;

  @Column({ name: 'whatsapp_number' })
  whatsappNumber: string;

  @Column({ name: 'facebook' })
  facebook: string;

  @Column({ name: 'instagram' })
  instagram: string;

  @Column({ name: 'tiktok' })
  tiktok: string;

  @Column({ name: 'twitter_x' })
  twitterX: string;

  @Column({ name: 'snapchat' })
  snapchat: string;

  @Column({ name: 'linkedin' })
  linkedin: string;

  @Column({ name: 'youtube' })
  youtube: string;

  @Column({ name: 'pinterest' })
  pinterest: string;
}
