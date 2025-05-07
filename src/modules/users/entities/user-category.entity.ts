import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from '@users/entities/user-profile.entity';

@Entity('user_categories')
export class UserCategory {
  @PrimaryGeneratedColumn('uuid', { name: 'user_category_id' })
  id: string;

  @OneToMany(() => UserProfile, (userProfile) => userProfile.category)
  userProfiles: UserProfile[];

  @Column({ name: 'user_category' })
  category: string;

  @Column({ name: 'user_requirements' })
  requirements: string;
}
