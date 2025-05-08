import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ChildEntity('bank')
export class Bank {
@PrimaryGeneratedColumn('uuid', { name: 'bank_id' })
bankId: string;

@Column({name:'currency'})
currency: string;

@Column({name:'bank_name'})
bankName: string;

@Column({name:'send_method_key'})
sendMethodKey: string;

@Column({name:'send_method_value'})
sendMethodValue: string;

@Column({name:'document_type'})
documentType: string;

@Column({name:'document_value'})
documentValue: string;
}
