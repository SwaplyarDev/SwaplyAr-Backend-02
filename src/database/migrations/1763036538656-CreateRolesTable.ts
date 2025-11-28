import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1763036538656 implements MigrationInterface {
    name = 'CreateRolesTable1763036538656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla roles
        await queryRunner.query(`CREATE TABLE "roles" (
            "role_id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "code" character varying(50) NOT NULL, 
            "name" character varying(100) NOT NULL, 
            "description" text, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            CONSTRAINT "UQ_roles_code" UNIQUE ("code"), 
            CONSTRAINT "PK_roles" PRIMARY KEY ("role_id")
        )`);

        // Agregar columna role_id a users
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid`);

        // Crear foreign key
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Insertar roles básicos
        await queryRunner.query(`INSERT INTO "roles" ("code", "name", "description") VALUES 
            ('user', 'Usuario', 'Usuario estándar de la plataforma'),
            ('admin', 'Administrador', 'Administrador del sistema')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
