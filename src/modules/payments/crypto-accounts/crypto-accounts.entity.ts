import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PaymentProviders } from '../payment-providers/payment-providers.entity';
import { CryptoNetworks } from '../../catalogs/crypto-networks/crypto-networks.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'crypto_accounts' })
export class CryptoAccounts {
  @PrimaryGeneratedColumn('uuid', { name: 'crypto_account_id' })
  cryptoAccountId: string;

  @ManyToOne(() => User, (user) => user.cryptoAccounts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PaymentProviders, (provider) => provider.cryptoAccounts, { nullable: false })
  @JoinColumn({ name: 'payment_provider_id' })
  paymentProvider: PaymentProviders;

  @ManyToOne(() => CryptoNetworks, (network) => network.cryptoAccounts, {
    nullable: false,
  })
  @JoinColumn({ name: 'crypto_network_id' })
  cryptoNetwork: CryptoNetworks;

  @Column({ type: 'varchar', nullable: false, name: 'wallet_address' })
  walletAddress: string;

  @Column({ type: 'varchar', nullable: true, name: 'tag_or_memo' })
  tagOrMemo: string;

  @Column({ type: 'varchar', length: 20, default: 'user', name: 'owner_type' })
  ownerType: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;
}
