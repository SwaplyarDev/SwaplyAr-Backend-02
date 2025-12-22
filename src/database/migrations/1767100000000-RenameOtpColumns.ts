import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameOtpColumns1767100000000 implements MigrationInterface {
  name = 'RenameOtpColumns1767100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename expiry_date -> expires_at and make it nullable
    await queryRunner.query(`ALTER TABLE "otp_codes" RENAME COLUMN "expiry_date" TO "expires_at"`);
    await queryRunner.query(`ALTER TABLE "otp_codes" ALTER COLUMN "expires_at" DROP NOT NULL`);

    // Rename is_used -> used
    await queryRunner.query(`ALTER TABLE "otp_codes" RENAME COLUMN "is_used" TO "used"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert names and nullability
    await queryRunner.query(`ALTER TABLE "otp_codes" RENAME COLUMN "used" TO "is_used"`);
    await queryRunner.query(`ALTER TABLE "otp_codes" RENAME COLUMN "expires_at" TO "expiry_date"`);
    await queryRunner.query(`ALTER TABLE "otp_codes" ALTER COLUMN "expiry_date" SET NOT NULL`);
  }
}
