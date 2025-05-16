import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('dim_approved')
export class DimApproved{
    @PrimaryGeneratedColumn('uuid', {name: 'approved_id'})
    id:string;

    @Column({name: 'swapliAr_send'})
    swapliArSend:string;

    @Column({name: 'transaction_receipt'})
    transactionRecipt:string;

    @Column({name: 'approved_note'})
    approvedNote:string;
}