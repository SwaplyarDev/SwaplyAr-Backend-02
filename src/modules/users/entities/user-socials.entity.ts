import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ name: 'whatsapp_number', nullable: true })
  whatsappNumber: string;

  @Column({ name: 'facebook', nullable: true })
  facebook: string;

  @Column({ name: 'instagram', nullable: true })
  instagram: string;

  @Column({ name: 'tiktok', nullable: true })
  tiktok: string;

  @Column({ name: 'twitter_x', nullable: true })
  twitterX: string;

  @Column({ name: 'snapchat', nullable: true })
  snapchat: string;

  @Column({ name: 'linkedin', nullable: true })
  linkedin: string;

  @Column({ name: 'youtube', nullable: true })
  youtube: string;

  @Column({ name: 'pinterest', nullable: true })
  pinterest: string;
}
