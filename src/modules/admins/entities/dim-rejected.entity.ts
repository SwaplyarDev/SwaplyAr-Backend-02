import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('dim_rejected')
export class DimRejected{
    @PrimaryGeneratedColumn('uuid', {name: 'dim_rejected_id'})
    id: string;
}