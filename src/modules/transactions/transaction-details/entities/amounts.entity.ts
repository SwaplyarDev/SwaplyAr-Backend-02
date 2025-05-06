import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('amounts')
export class Amounts{
    @PrimaryGeneratedColumn('uuid', { name: 'amount_id' })
    amountId: string;

    @Column({name:'amount_sent'})
    amountSent:number;

    @Column({name:'currency_sent'})
    currencySent:string;

    @Column({name:'amount_received'})
    amountReceived:number;

    @Column({name:'currency_receiverd'})
    currencyReceiver:string;

    @Column({name:'received'})
    received: boolean;
}