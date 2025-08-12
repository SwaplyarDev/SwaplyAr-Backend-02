import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAccount1750000002000 implements MigrationInterface {
  name = 'CreateUserAccount1750000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user_account (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        account_name VARCHAR(255) NOT NULL,
        platform platform_enum NOT NULL,
        currency VARCHAR(10) NOT NULL,
        type_id UUID NOT NULL,
        user_id UUID NOT NULL,
        status admin_status_enum NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_account`);
  }
}
