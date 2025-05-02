import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SenderFinancialAccount {
    @PrimaryGeneratedColumn('uuid', { name: 'sender_accounts_id' })
    id: string;

    @Column({name:"first_name"})
    firstName:string;

    @Column({name:"last_name"})
    lastName:string;

    @Column({name:"identification_number"})
    identificationNumber:number;

    @Column({name:"phone_number"})
    phoneNumber:string;

    @Column({name:"email"})
    email:string;
    
    //@Column()
    //payment_method_id:string; fk de payment method
}
