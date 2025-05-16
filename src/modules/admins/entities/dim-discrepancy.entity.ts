import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('dim_discrepancy')
export class DimDiscrepancy{
    @PrimaryGeneratedColumn('uuid', {name: 'dim_discrepancy_id'})
    id: string;

    @Column({name: 'cause'})
    cause:string;

    @Column({name: 'result'})
    result:string;
}