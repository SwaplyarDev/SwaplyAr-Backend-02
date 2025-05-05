import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionPaymentInfo } from "./transaction-payment-info.entity";

@Entity('regrets')
export class Regrets{
    @PrimaryGeneratedColumn('uuid', { name: 'regret_id' })
    regretId: string;

    @Column({name:'last_name'})
    lastName:string;

    @Column({name:'phone_number'})
    phoneNumber:string;

    @Column({name:'description'})
    description:string;

    @ManyToOne(()=> TransactionPaymentInfo, (info) => info.transactionPaymentInfoId)
    @JoinColumn({name: 'transaction_payment_info_id'})
    transactionPaymentInfo: TransactionPaymentInfo;

    // @ManyToOne(()=> UserEmail, (email) => email.emailId)
    // @JoinColumn({name: 'email_id'})
    // userEmail: UserEmail;
}