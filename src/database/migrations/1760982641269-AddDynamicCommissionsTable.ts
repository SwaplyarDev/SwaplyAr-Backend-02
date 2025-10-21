import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDynamicCommissionsTable1760982641269 implements MigrationInterface {
    name = 'AddDynamicCommissionsTable1760982641269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transactions_final_status_enum" RENAME TO "transactions_final_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_final_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" TYPE "public"."transactions_final_status_enum" USING "final_status"::"text"::"public"."transactions_final_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."transactions_final_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."administracion_master_status_enum" RENAME TO "administracion_master_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."administracion_master_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" TYPE "public"."administracion_master_status_enum" USING "status"::"text"::"public"."administracion_master_status_enum"`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."administracion_master_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."administracion_status_log_status_enum" RENAME TO "administracion_status_log_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."administracion_status_log_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ALTER COLUMN "status" TYPE "public"."administracion_status_log_status_enum" USING "status"::"text"::"public"."administracion_status_log_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."administracion_status_log_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."administracion_status_log_status_enum_old" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ALTER COLUMN "status" TYPE "public"."administracion_status_log_status_enum_old" USING "status"::"text"::"public"."administracion_status_log_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."administracion_status_log_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."administracion_status_log_status_enum_old" RENAME TO "administracion_status_log_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."administracion_master_status_enum_old" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" TYPE "public"."administracion_master_status_enum_old" USING "status"::"text"::"public"."administracion_master_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "administracion_master" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."administracion_master_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."administracion_master_status_enum_old" RENAME TO "administracion_master_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_final_status_enum_old" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" TYPE "public"."transactions_final_status_enum_old" USING "final_status"::"text"::"public"."transactions_final_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "final_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."transactions_final_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_final_status_enum_old" RENAME TO "transactions_final_status_enum"`);
    }

}
