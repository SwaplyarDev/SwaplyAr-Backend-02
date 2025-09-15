import { MigrationInterface, QueryRunner } from 'typeorm';

export class EntityIndexesFinancialAccounts1757936918191 implements MigrationInterface {
  name = 'EntityIndexesFinancialAccounts1757936918191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Quitar índices antiguos
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_fe346b48f443c7c15693b5f8cd"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_02d578d93253ca308ec3110982"`);

    // Default de timestamp en proofs
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" ALTER COLUMN "create_at" SET DEFAULT now()`,
    );

    // Cambiar tipo de columnas sin perder datos
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ALTER COLUMN "method" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ALTER COLUMN "cpf" TYPE character varying(14)`,
    );

    // Constraints/Índices nuevos
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "UQ_08546893edd711eb732b066959d" UNIQUE ("pix_key")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_proof_of_payments_created_at" ON "proof_of_payments" ("create_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_payment_methods_method" ON "payment_methods" ("method") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_payment_methods_platform_method" ON "payment_methods" ("platform", "method") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_pix_virtual_bank_id" ON "payment_methods" ("virtual_bank_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_pix_key" ON "payment_methods" ("pix_key") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_pix_cpf" ON "payment_methods" ("cpf") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_financial_accounts_first_name" ON "financial_accounts" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_financial_accounts_last_name" ON "financial_accounts" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_financial_accounts_name" ON "financial_accounts" ("last_name", "first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_sender_fin_accounts_created_by" ON "financial_accounts" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_sender_fin_accounts_phone" ON "financial_accounts" ("phone_number") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_sender_fin_accounts_phone"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_sender_fin_accounts_created_by"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_financial_accounts_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_financial_accounts_last_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_financial_accounts_first_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_pix_cpf"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_pix_key"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_pix_virtual_bank_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_payment_methods_platform_method"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_payment_methods_method"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_proof_of_payments_created_at"`);
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT IF EXISTS "UQ_08546893edd711eb732b066959d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ALTER COLUMN "cpf" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ALTER COLUMN "method" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" ALTER COLUMN "create_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_02d578d93253ca308ec3110982" ON "payment_methods" ("method") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fe346b48f443c7c15693b5f8cd" ON "payment_methods" ("platform", "method") `,
    );
  }
}
