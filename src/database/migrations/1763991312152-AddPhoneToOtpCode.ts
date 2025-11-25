import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToOtpCode1763991312152 implements MigrationInterface {
  name = 'AddPhoneToOtpCode1763991312152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp_codes" ADD "phone" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp_codes" DROP COLUMN "phone"`);
  }
}
