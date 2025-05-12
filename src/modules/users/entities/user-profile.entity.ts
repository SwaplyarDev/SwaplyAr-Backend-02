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

  @Column({ name: 'middle_name', nullable: true })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'identification', nullable: true })
  identification: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  birthday: Date;

  @Column({ name: 'age', type: 'integer', nullable: true })
  age: number;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: ['M', 'F', 'O'],
    default: 'M',
    nullable: true,
  })
  gender: 'M' | 'F' | 'O';

  @Column({ name: 'last_activity', nullable: true })
  lastActivity: Date;

  @OneToOne(() => UserSocials, (socials) => socials.userProfile, {
    cascade: true,
  })
  socials: UserSocials;

  @ManyToOne(() => UserCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_category_id' })
  category: UserCategory;

  @Column({ name: 'profile_picture_url', nullable: true })
  profilePictureUrl: string;
}
