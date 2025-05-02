import { PaymentMethod } from "@transactions/payment/payment-methods/entities/paymentMethod.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('receiver_bank_accounts')
export class ReceiverBankAccount {
    @PrimaryGeneratedColumn('uuid', { name: 'receiver_account_id' })
    receiverAccountId: string;
    
    @Column({ name: 'receiver_first_name' })
    receiverFirstName: string;
    
    @Column({ name: 'receiver_last_name' })
    receiverLastName: string;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.paymentMethodId)
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: string;
    }