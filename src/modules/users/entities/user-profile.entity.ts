import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSocials } from '@users/entities/user-socials.entity';
import { UserCategory } from '@users/entities/user-category.entity';
import { User } from '@users/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'user_profile_id' })
  id: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name' })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'identification' })
  identification: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'birthday' })
  birthday: Date;

  @Column({ name: 'age', type: 'integer' })
  age: number;

  @Column({ name: 'gender', type: 'enum', enum: ['M', 'F', 'O'], default: 'M' })
  gender: 'M' | 'F' | 'O';

  @Column({ name: 'last_activity' })
  lastActivity: Date;

  @OneToOne(() => UserSocials, (socials) => socials.userProfile, {
    cascade: true,
  })
  socials: UserSocials;

  @ManyToOne(() => UserCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_category_id' })
  category: UserCategory;

  @Column({ name: 'profile_picture_url' })
  profilePictureUrl: string;
}
