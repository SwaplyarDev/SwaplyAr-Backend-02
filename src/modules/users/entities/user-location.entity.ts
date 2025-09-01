import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_locations')
export class UserLocation {
  @PrimaryGeneratedColumn('uuid', { name: 'user_location_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'department' })
  department: string;

  @Column({ name: 'date', type: 'timestamp with time zone' })
  date: Date;
}
