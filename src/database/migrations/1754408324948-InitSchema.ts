import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1754408324948 implements MigrationInterface {
    name = 'InitSchema1754408324948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la constraint foreign key existente
        await queryRunner.query(`ALTER TABLE "virtual_bank" DROP CONSTRAINT "FK_80c98daa72c7a7331174b51460d"`);

        // Permitir temporalmente NULL para evitar error con datos existentes
        await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" DROP NOT NULL`);

        // Aquí podrías hacer una actualización de datos si es necesaria, ejemplo:
        // await queryRunner.query(`UPDATE "virtual_bank" SET "account_id" = 'some-uuid' WHERE "account_id" IS NULL`);

        // Cambiar el tipo de columna a UUID (si es que estaba otro tipo)
        await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" SET DATA TYPE uuid USING "account_id"::uuid`);

        // Restaurar NOT NULL (asegúrate que no hay NULLs en esta columna)
        await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" SET NOT NULL`);

        // Volver a crear la constraint de foreign key
        await queryRunner.query(`
            ALTER TABLE "virtual_bank"
            ADD CONSTRAINT "FK_80c98daa72c7a7331174b51460d"
            FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir: eliminar constraint FK
        await queryRunner.query(`ALTER TABLE "virtual_bank" DROP CONSTRAINT "FK_80c98daa72c7a7331174b51460d"`);

        // Permitir NULL temporalmente para evitar problemas
        await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" DROP NOT NULL`);

        // Volver el tipo de columna al tipo anterior (ajustar según el tipo previo)
        // Ejemplo, si antes era varchar, reemplaza a varchar(255) o lo que sea correcto:
        await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" SET DATA TYPE varchar(255)`);

        // Si querés restaurar NOT NULL en down, solo si es seguro
        // await queryRunner.query(`ALTER TABLE "virtual_bank" ALTER COLUMN "account_id" SET NOT NULL`);

        // Volver a crear la constraint foreign key (ajusta si el tipo y tabla referenciada cambia)
        await queryRunner.query(`
            ALTER TABLE "virtual_bank"
            ADD CONSTRAINT "FK_80c98daa72c7a7331174b51460d"
            FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
