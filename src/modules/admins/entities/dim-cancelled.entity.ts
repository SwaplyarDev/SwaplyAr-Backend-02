import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('dim_cancelled')
export class DimCancelled{
    @PrimaryGeneratedColumn('uuid', {name: 'cancelled_id'})
    id:string;

    @Column({name: 'cause'})
    cause:string;

    @Column({name: 'transaction_SwaplyAr'})
    transactionSwaplyAr: string;

    @Column({name: 'transaction_receipt'})
    transactionRecepits: string;

    @Column({name:'reason_note'})
    reasonNote: string;
}