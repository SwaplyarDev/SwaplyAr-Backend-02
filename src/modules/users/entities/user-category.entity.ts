import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_categories')
export class UserCategory {
  @PrimaryGeneratedColumn('uuid', { name: 'user_category_id' })
  id: string;

  @Column({ name: 'user_category' })
  category: string;

  @Column({ name: 'user_reference' })
  reference: string;
}
