import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnums1750000001000 implements MigrationInterface {
  name = 'CreateEnums1750000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE platform_enum AS ENUM (
        'bank', 'paypal', 'wise', 'payoneer', 'pix', 'virtual_bank', 'receiver_crypto'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE transaction_status_enum AS ENUM (
        'pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit',
        'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed', 'stop'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE admin_status_enum AS ENUM (
        'pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit',
        'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS admin_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS platform_enum`);
  }
}
