import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('dim_status')
export class DimStatus{
    @PrimaryGeneratedColumn('uuid', { name: 'id_status'})
    id: string;

    @Column({name: 'status_name', nullable:false})
    status: string;
}