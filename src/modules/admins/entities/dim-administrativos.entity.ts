import { Admin, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminMaster } from "./admin-master.entity";

@Entity('dim_administrativos')
export class DimAdministrativos{
    @PrimaryGeneratedColumn('uuid', {name:'admin_op_id'})
    id: string;

    @Column({name: 'nombre_completo', nullable: false})
    nombreCompleto: string;

    @Column({name: 'nombre', nullable: false})
    nombre:string;

    @Column({name: 'apellido', nullable: false})
    apellido:string;

    @Column({name: 'hora_trabajo', nullable: true})
    horaTrabajo: Date;

    @Column({name: 'hora_entrada', nullable: true})
    horaEntrada: Date;

    @Column({name: 'hora_salida', nullable: true})
    horaSalida:Date;

    @Column({name: 'phone', nullable: true})
    phone:string;

    @Column({name: 'mail', nullable: true})
    mail:string;

    @Column({name: 'DNI', nullable: true})
    DNI:string;

    @Column({name: 'fecha_contratacion', nullable: true})
    fechaContratacion: Date;

    @OneToOne(()=> AdminMaster, (adminMaster) => adminMaster.id)
    adminId: AdminMaster;
}