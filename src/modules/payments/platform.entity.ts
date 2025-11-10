import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Provider } from './provider.entity';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Provider, (provider) => provider.platform)
  providers: Provider[];
}
