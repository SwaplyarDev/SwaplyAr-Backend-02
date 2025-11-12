import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PaymentProviders } from './providers.entity';
import { CryptoNetworks } from './crypto-networks.entity';
import { User } from '../../users/entities/user.entity';

@Entity('crypto_accounts')
export class CryptoAccounts {
  @PrimaryGeneratedColumn('uuid')
  bank_account_id: string;

  @ManyToOne(() => User, (user) => user.crypto_accounts, { nullable: false })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.crypto_accounts, { nullable: false })
  payment_provider: PaymentProviders;

  @ManyToOne(() => CryptoNetworks, (network) => network.crypto_accounts, {
    nullable: false,
  })
  crypto_network: CryptoNetworks;

  @Column({ type: 'varchar', nullable: false })
  wallet_address: string;

  @Column({ type: 'varchar', nullable: true })
  tag_or_memo: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  owner_type: string;

  @ManyToOne(() => User, { nullable: false })
  created_by: User;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;
}
