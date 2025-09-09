import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_pix')
export class UserPix {
  @PrimaryGeneratedColumn('uuid', { name: 'pix_id' })
  pix_id: string;

  @Column({ name: 'pix_key' })
  pix_key: string;

  @Column({ name: 'pix_value' })
  pix_value: string;

  @Column({ type: 'char', length: 11 })
  cpf: string;

  // 👇 agregamos la FK como propiedad explícita
  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'accountId' })
  userAccount: UserAccount;
}
