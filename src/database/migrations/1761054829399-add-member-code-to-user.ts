import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMemberCodeToUser1761054829399 implements MigrationInterface {
    name = 'AddMemberCodeToUser1761054829399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_user_discounts" DROP CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc"`);
        await queryRunner.query(`ALTER TABLE "dynamic_commissions" DROP CONSTRAINT "UQ_dynamic_commissions_from_to"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "member_code" character varying(8) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_54edc787000bbce448a70bc3e83" UNIQUE ("member_code")`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" DROP CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0"`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ADD "transaction_id" uuid`);
        await queryRunner.query(`ALTER TABLE "dynamic_commissions" ADD CONSTRAINT "UQ_0c6594adb488a7fe97a77a4b082" UNIQUE ("from_platform", "to_platform")`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ADD CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0" FOREIGN KEY ("transaction_id") REFERENCES "administracion_master"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_user_discounts" ADD CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc" FOREIGN KEY ("user_discount_id") REFERENCES "user_discounts"("user_discount_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_user_discounts" DROP CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc"`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" DROP CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0"`);
        await queryRunner.query(`ALTER TABLE "dynamic_commissions" DROP CONSTRAINT "UQ_0c6594adb488a7fe97a77a4b082"`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ADD "transaction_id" character varying`);
        await queryRunner.query(`ALTER TABLE "administracion_status_log" ADD CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0" FOREIGN KEY ("transaction_id") REFERENCES "administracion_master"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_54edc787000bbce448a70bc3e83"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "member_code"`);
        await queryRunner.query(`ALTER TABLE "dynamic_commissions" ADD CONSTRAINT "UQ_dynamic_commissions_from_to" UNIQUE ("from_platform", "to_platform")`);
        await queryRunner.query(`ALTER TABLE "transaction_user_discounts" ADD CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc" FOREIGN KEY ("user_discount_id") REFERENCES "user_discounts"("user_discount_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
