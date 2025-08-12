import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactions1750000003000 implements MigrationInterface {
  name = 'CreateTransactions1750000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_account_id UUID NOT NULL,
        status transaction_status_enum NOT NULL DEFAULT 'pending',
        amount NUMERIC(15, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS transactions`);
  }
}
