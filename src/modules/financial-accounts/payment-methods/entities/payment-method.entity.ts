import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid', { name: 'payment_method_id' })
    id: string;
  
    @Column({name: 'platform_id'})
    platformId: string;// fk de la tabla plataform
 
    @Column({ name: 'method_type'})
    method_type: 'bank' | 'virtul_bank' | 'receiver_crypto' | 'pix'; 

    @Column({name: 'method_id'})
    methodId: string; // fk de la tabla de banco o billeteras

}
