import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Amount {
    @PrimaryGeneratedColumn("uuid", { name: "amount_id" })
    id: string;
    @Column()
    amountSent:number //cantidad enviada
     @Column()
    currencySent:string //moneda enviada
     @Column()
    amountReceived:number //cantidad recibida
     @Column()
    currencyReceived:string //moneda recibida
     @Column()
    received : boolean //recibido o no
}
