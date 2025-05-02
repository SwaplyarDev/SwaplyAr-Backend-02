import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
    id: string;
    //@Column()
    //plataform_id:string; // fk de la tabla plataform
    //@Column()
    //method_id:string; // fk de la tabla de banco o billeteras
}
