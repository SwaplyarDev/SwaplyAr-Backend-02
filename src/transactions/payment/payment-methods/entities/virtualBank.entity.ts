import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('virtual_bank')
export class VirtualBankAccount {
    @PrimaryGeneratedColumn('uuid', { name: 'virtual_bank_id' })
    virtualBankId: string;

    @Column({ name: 'currency' })
    currency: string;

    @Column({name:'email_account'})
    emailAccount: string;

    @Column({name:'transfer_code'})
    transferCode: string;
}