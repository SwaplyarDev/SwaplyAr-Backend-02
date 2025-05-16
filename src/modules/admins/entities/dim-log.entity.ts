import { Column, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AdminMaster } from "./admin-master.entity";

export class DimLog{
    @PrimaryGeneratedColumn('uuid', {name: 'dim_log_id'})
    id: string;

    @Column({name: 'status'})
    status: string;

    @Column({name: 'changed_in'})
    changedIn: Date;

    @OneToOne(() => AdminMaster, (adminMaster) => adminMaster.id)
    adm_id: string;
}