import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_socials')
export class UserSocials {
  @PrimaryGeneratedColumn('uuid', { name: 'user_socials_id' })
  id: string;

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
