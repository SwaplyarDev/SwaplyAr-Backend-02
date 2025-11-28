import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleFeatures1763123456789 implements MigrationInterface {
    name = 'AddRoleFeatures1763123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Agregar columnas desnormalizadas a users
        await queryRunner.query(`ALTER TABLE "users" ADD "role_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_description" character varying`);

        // 2. Agregar columna updated_at a users y roles
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);

        // 3. Crear tabla user_roles (Many-to-Many)
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_user_roles" PRIMARY KEY ("user_id", "role_id"),
                CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE
            )
        `);

        // 4. Poblar columnas desnormalizadas para usuarios existentes
        await queryRunner.query(`
            UPDATE users 
            SET 
                role_code = COALESCE(subquery.codes, ''),
                role_name = COALESCE(subquery.names, ''),
                role_description = COALESCE(subquery.descriptions, '')
            FROM (
                SELECT 
                    u.user_id,
                    string_agg(r.code, ', ' ORDER BY r.code) as codes,
                    string_agg(r.name, ', ' ORDER BY r.code) as names,
                    string_agg(r.description, ', ' ORDER BY r.code) as descriptions
                FROM users u
                LEFT JOIN user_roles ur ON u.user_id = ur.user_id
                LEFT JOIN roles r ON ur.role_id = r.role_id
                GROUP BY u.user_id
            ) subquery
            WHERE users.user_id = subquery.user_id
        `);

        // 5. Crear función para sincronizar roles automáticamente
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION sync_user_roles()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE users 
                SET 
                    role_code = COALESCE((
                        SELECT string_agg(r.code, ', ' ORDER BY r.code)
                        FROM user_roles ur
                        JOIN roles r ON ur.role_id = r.role_id
                        WHERE ur.user_id = COALESCE(NEW.user_id, OLD.user_id)
                    ), ''),
                    role_name = COALESCE((
                        SELECT string_agg(r.name, ', ' ORDER BY r.code)
                        FROM user_roles ur
                        JOIN roles r ON ur.role_id = r.role_id
                        WHERE ur.user_id = COALESCE(NEW.user_id, OLD.user_id)
                    ), ''),
                    role_description = COALESCE((
                        SELECT string_agg(r.description, ', ' ORDER BY r.code)
                        FROM user_roles ur
                        JOIN roles r ON ur.role_id = r.role_id
                        WHERE ur.user_id = COALESCE(NEW.user_id, OLD.user_id)
                    ), '')
                WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
                
                RETURN COALESCE(NEW, OLD);
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 6. Crear triggers para sincronización automática
        await queryRunner.query(`
            CREATE TRIGGER sync_user_roles_insert
                AFTER INSERT ON user_roles
                FOR EACH ROW EXECUTE FUNCTION sync_user_roles();
        `);

        await queryRunner.query(`
            CREATE TRIGGER sync_user_roles_delete
                AFTER DELETE ON user_roles
                FOR EACH ROW EXECUTE FUNCTION sync_user_roles();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar triggers
        await queryRunner.query(`DROP TRIGGER IF EXISTS sync_user_roles_delete ON user_roles`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS sync_user_roles_insert ON user_roles`);
        
        // Eliminar función
        await queryRunner.query(`DROP FUNCTION IF EXISTS sync_user_roles()`);
        
        // Eliminar tabla user_roles
        await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
        
        // Eliminar columnas
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_description"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_code"`);
    }
}