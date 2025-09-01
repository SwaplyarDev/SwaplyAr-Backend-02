import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFinancialAccountsRelation1750000004000 implements MigrationInterface {
  name = 'FixFinancialAccountsRelation1750000004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar FK antigua si existe (relación con users)
    await queryRunner.query(`
      ALTER TABLE financial_accounts
      DROP CONSTRAINT IF EXISTS fk_financial_accounts_user;
    `);

    await queryRunner.query(`
      ALTER TABLE financial_accounts
      DROP COLUMN IF EXISTS user_id;
    `);

    // 2. Agregar columna y FK hacia payment_methods
    await queryRunner.query(`
      ALTER TABLE financial_accounts
      ADD COLUMN IF NOT EXISTS payment_method_id UUID NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE financial_accounts
      ADD CONSTRAINT fk_financial_accounts_payment_method
      FOREIGN KEY (payment_method_id)
      REFERENCES payment_methods(payment_method_id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir a la relación anterior con users
    await queryRunner.query(`
      ALTER TABLE financial_accounts
      DROP CONSTRAINT IF EXISTS fk_financial_accounts_payment_method;
    `);

    await queryRunner.query(`
      ALTER TABLE financial_accounts
      DROP COLUMN IF EXISTS payment_method_id;
    `);

    await queryRunner.query(`
      ALTER TABLE financial_accounts
      ADD COLUMN user_id UUID;
    `);

    await queryRunner.query(`
      ALTER TABLE financial_accounts
      ADD CONSTRAINT fk_financial_accounts_user
      FOREIGN KEY (user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE;
    `);
  }
}
