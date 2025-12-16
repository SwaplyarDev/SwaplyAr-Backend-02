import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderCurrenciesAndCurrencyIds1765600000000 implements MigrationInterface {
  name = 'AddProviderCurrenciesAndCurrencyIds1765600000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Create provider_currencies join table (with inherited flag)
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "provider_currencies" (
      "provider_id" uuid NOT NULL,
      "currency_id" uuid NOT NULL,
      "inherited" boolean NOT NULL DEFAULT false,
      PRIMARY KEY ("provider_id", "currency_id")
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_provider_currencies_provider" ON "provider_currencies" ("provider_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_provider_currencies_currency" ON "provider_currencies" ("currency_id")`);

    // Add FK constraints only if they don't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_provider_currencies_provider'
        ) THEN
          ALTER TABLE "provider_currencies" ADD CONSTRAINT "fk_provider_currencies_provider" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("payment_provider_id") ON DELETE CASCADE;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_provider_currencies_currency'
        ) THEN
          ALTER TABLE "provider_currencies" ADD CONSTRAINT "fk_provider_currencies_currency" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    // 2) Populate provider_currencies with currencies inherited from the provider's country (if any)
    await queryRunner.query(`
      INSERT INTO provider_currencies (provider_id, currency_id, inherited)
      SELECT p.payment_provider_id, cc.currency_id, true
      FROM payment_providers p
      JOIN countries_currencies cc ON cc.country_id = p.country_id
      WHERE p.country_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM provider_currencies pc WHERE pc.provider_id = p.payment_provider_id AND pc.currency_id = cc.currency_id
        );
    `);

    // 3) Add currency_id columns to accounts tables (if not exists)
    await queryRunner.query(`ALTER TABLE "bank_accounts" ADD COLUMN IF NOT EXISTS "currency_id" uuid`);
    await queryRunner.query(`ALTER TABLE "virtual_bank_accounts" ADD COLUMN IF NOT EXISTS "currency_id" uuid`);
    await queryRunner.query(`ALTER TABLE "crypto_accounts" ADD COLUMN IF NOT EXISTS "currency_id" uuid`);

    // 4) Migrate existing textual currency codes (if present) into currency_id via currencies.code
    await queryRunner.query(`
      UPDATE bank_accounts b
      SET currency_id = c.currency_id
      FROM currencies c
      WHERE b.currency IS NOT NULL AND c.code = b.currency;
    `);

    await queryRunner.query(`
      UPDATE virtual_bank_accounts v
      SET currency_id = c.currency_id
      FROM currencies c
      WHERE v.currency IS NOT NULL AND c.code = v.currency;
    `);

    // crypto_accounts historically may not have a 'currency' text column; we attempt a safe update if present
    await queryRunner.query(`
      UPDATE crypto_accounts a
      SET currency_id = c.currency_id
      FROM currencies c
      WHERE EXISTS (SELECT 1 FROM information_schema.columns col WHERE col.table_name = 'crypto_accounts' AND col.column_name = 'currency')
        AND a.currency IS NOT NULL AND c.code = a.currency;
    `);

    // 5) Add indexes and FK constraints for currency_id columns
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_bank_accounts_currency_id" ON "bank_accounts" ("currency_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_virtual_bank_accounts_currency_id" ON "virtual_bank_accounts" ("currency_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_crypto_accounts_currency_id" ON "crypto_accounts" ("currency_id")`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_bank_accounts_currency'
        ) THEN
          ALTER TABLE "bank_accounts" ADD CONSTRAINT "fk_bank_accounts_currency" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id");
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_virtual_bank_accounts_currency'
        ) THEN
          ALTER TABLE "virtual_bank_accounts" ADD CONSTRAINT "fk_virtual_bank_accounts_currency" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id");
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_crypto_accounts_currency'
        ) THEN
          ALTER TABLE "crypto_accounts" ADD CONSTRAINT "fk_crypto_accounts_currency" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id");
        END IF;
      END
      $$;
    `);

    // 6) If there are payment_providers with country_code but null country_id, try to populate country_id
    await queryRunner.query(`
      UPDATE payment_providers p
      SET country_id = c.country_id
      FROM countries c
      WHERE p.country_id IS NULL AND p.country_code IS NOT NULL AND c.code = p.country_code;
    `);

    // Add FK for payment_providers.country_id if not exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_payment_providers_country'
        ) THEN
          ALTER TABLE "payment_providers" ADD CONSTRAINT "fk_payment_providers_country" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id");
        END IF;
      END
      $$;
    `);

    // 7) Add countries.currency_default_id and populate from countries.currency (code) if exists
    await queryRunner.query(`ALTER TABLE "countries" ADD COLUMN IF NOT EXISTS "currency_default_id" uuid`);
    await queryRunner.query(`
      UPDATE countries c
      SET currency_default_id = cur.currency_id
      FROM currencies cur
      WHERE c.currency_default IS NOT NULL AND cur.code = c.currency_default;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc WHERE tc.constraint_name = 'fk_countries_currency_default'
        ) THEN
          ALTER TABLE "countries" ADD CONSTRAINT "fk_countries_currency_default" FOREIGN KEY ("currency_default_id") REFERENCES "currencies"("currency_id");
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse of up: try to drop constraints and columns and the join table

    // Drop FK/constraints for countries.currency_default_id and drop column
    await queryRunner.query(`ALTER TABLE "countries" DROP CONSTRAINT IF EXISTS "fk_countries_currency_default"`);
    await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN IF EXISTS "currency_default_id"`);

    // Drop FK on payment_providers.country_id (but don't drop column to avoid data loss)
    await queryRunner.query(`ALTER TABLE "payment_providers" DROP CONSTRAINT IF EXISTS "fk_payment_providers_country"`);

    // Drop currency FKs and indexes on accounts
    await queryRunner.query(`ALTER TABLE "crypto_accounts" DROP CONSTRAINT IF EXISTS "fk_crypto_accounts_currency"`);
    await queryRunner.query(`ALTER TABLE "virtual_bank_accounts" DROP CONSTRAINT IF EXISTS "fk_virtual_bank_accounts_currency"`);
    await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT IF EXISTS "fk_bank_accounts_currency"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_crypto_accounts_currency_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_virtual_bank_accounts_currency_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_bank_accounts_currency_id"`);

    // Drop currency_id columns (data will be lost on down)
    await queryRunner.query(`ALTER TABLE "crypto_accounts" DROP COLUMN IF EXISTS "currency_id"`);
    await queryRunner.query(`ALTER TABLE "virtual_bank_accounts" DROP COLUMN IF EXISTS "currency_id"`);
    await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN IF EXISTS "currency_id"`);

    // Remove provider_currencies table
    await queryRunner.query(`ALTER TABLE "provider_currencies" DROP CONSTRAINT IF EXISTS "fk_provider_currencies_provider"`);
    await queryRunner.query(`ALTER TABLE "provider_currencies" DROP CONSTRAINT IF EXISTS "fk_provider_currencies_currency"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_provider_currencies_provider"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_provider_currencies_currency"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "provider_currencies"`);
  }
}
