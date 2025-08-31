import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('user_questions')
export class UserQuestion {
  @PrimaryGeneratedColumn('uuid', { name: 'user_question_id' })
  id: string;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;
}
