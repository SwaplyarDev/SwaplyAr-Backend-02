import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user_pix')
export class UserPix {
  @PrimaryGeneratedColumn('uuid', { name: 'pix_id' })
  pix_id: string;

  @Column({ name: 'account_id', type: 'uuid' })
  account_id: string;

  @Column({ name: 'virtual_bank_id' })
  virtual_bank_id: string;

  @Column({ name: 'pix_key' })
  pix_key: string;

  @Column({ name: 'pix_value' })
  pix_value: string;

  @Column()
  cpf: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  userAccount: UserAccount;
}