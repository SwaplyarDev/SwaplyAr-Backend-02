import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { CryptoAccounts } from '../../payments/crypto-accounts/crypto-accounts.entity';

@Entity('crypto_networks')
export class CryptoNetworks {
  @PrimaryGeneratedColumn('uuid', { name: 'crypto_network_id' })
  crypto_network_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @OneToMany(() => CryptoAccounts, (account) => account.crypto_network)
  crypto_accounts: CryptoAccounts[];
}
