import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_methods')
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
    paymentMethodId: string;

    @Column({name: 'platform_id'})
    platformId: string;

    @Column({ name: 'method_type'})
    method_type: 'bank' | 'virtul_bank' | 'receiver_crypto' | 'pix';

    @Column({name: 'method_id'})
    methodId: string;
}
