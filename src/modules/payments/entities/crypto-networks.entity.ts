import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { CryptoAccounts } from '../accounts/crypto-accounts/crypto-accounts.entity';

@Entity('crypto_networks')
export class CryptoNetworks {
  @PrimaryGeneratedColumn('uuid', { name: 'crypto_network_id' })
  cryptoNetworkId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CryptoAccounts, (account) => account.cryptoNetwork)
  cryptoAccounts: CryptoAccounts[];
}
