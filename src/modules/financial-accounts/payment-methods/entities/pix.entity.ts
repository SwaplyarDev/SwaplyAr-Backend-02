import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pix')
export class Pix {
  @PrimaryGeneratedColumn('uuid', { name: 'pix_id' })
  pixId: string;

  @Column({ name: 'virtual_bank_id' })
  virtualBankId: string;

  @Column({ name: 'pix_key' })
  pixKey: string;

  @Column({ name: 'pix_value' })
  pixValue: string;

  @Column({ name: 'cpf' })
  cpf: string;
}
