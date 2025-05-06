import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transaction_payment_info')
export class TransactionPaymentInfo{
    @PrimaryGeneratedColumn('uuid', { name: 'transaction_payment_info_id' })
    transactionPaymentInfoId: string;

    @Column({name:'transaction_id'})
    transactionId:string;

    @Column({name:'type'})
    type:'complete' | 'pending' | 'refunded';

    @Column({name:'note'})
    note:string;

    @Column({name:'receipt'})
    receipt:string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
}
