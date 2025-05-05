import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSocials } from '@users/entities/user-socials.entity';
import { UserCategory } from '@users/entities/user-category.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { name: 'user_profile_id' })
  id: string;

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

  @Column('last_activity')
  lastActivity: Date;

  @OneToOne(() => UserSocials, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'user_socials_id' })
  userSocials: UserSocials;

  @OneToOne(() => UserCategory, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'user_category_id' })
  category: UserCategory;

  @Column('profile_picture_url')
  profilePictureUrl: string;
}
