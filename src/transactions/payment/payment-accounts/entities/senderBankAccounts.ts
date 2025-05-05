import { PaymentMethod } from "@transactions/payment/payment-methods/entities/paymentMethod.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('sender_bank_accounts')
export class SenderBankAccount {
@PrimaryGeneratedColumn('uuid', { name: 'sender_account_id' })
senderAccountId: string;

@Column({name: 'sender_first_name'})
senderFirstName: string;

@Column({name: 'sender_last_name'})
senderLastName: string;

@Column({name: 'payment_method_id'})
paymentMethodId: string;

@Column({name:'sender_identification'})
senderIdentification: string;

@Column({name:'sender_phone_number'})
senderPhoneNumber: string;

@Column({name:'sender_email'})
senderEmail: string;

@ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.paymentMethodId)
@JoinColumn({ name: 'payment_method_id' })
paymentMethod: string;
}
