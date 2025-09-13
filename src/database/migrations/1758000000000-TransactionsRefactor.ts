import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionsRefactor1758000000000 implements MigrationInterface {
  name = 'TransactionsRefactor1758000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) proof_of_payments: agregar transaction_id y FK + índice
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" ADD "transaction_id" character varying(10)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_proof_of_payments_transaction_id" ON "proof_of_payments" ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" ADD CONSTRAINT "FK_proof_payments_transaction" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 2) transactions: remover payments_id (OneToOne obsoleto)
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "FK_cdee4818a64ef6555829c23f519"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "REL_cdee4818a64ef6555829c23f51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN IF EXISTS "payments_id"`,
    );

    // 3) transactions: agregar columnas desnormalizadas de monto
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount_value" numeric(18,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount_currency" character varying(3)`,
    );

    // 4) transactions: agregar user_discount_id + índice + FK
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "user_discount_id" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_user_discount_id" ON "transactions" ("user_discount_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_user_discount" FOREIGN KEY ("user_discount_id") REFERENCES "user_discounts"("user_discount_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 5) user_discounts: remover relación 1:1 con transactions (columna transaction_id)
    await queryRunner.query(
      `ALTER TABLE "user_discounts" DROP CONSTRAINT IF EXISTS "FK_9ff3f6733494645af3a5bd0cc7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" DROP CONSTRAINT IF EXISTS "REL_9ff3f6733494645af3a5bd0cc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" DROP COLUMN IF EXISTS "transaction_id"`,
    );

    // 6) Índices compuestos para listados
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_sender_created_at" ON "transactions" ("sender_account_id", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_final_created_at" ON "transactions" ("final_status", "created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir índices compuestos
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transactions_final_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transactions_sender_created_at"`,
    );

    // Restaurar columna transaction_id en user_discounts y sus constraints
    await queryRunner.query(
      `ALTER TABLE "user_discounts" ADD "transaction_id" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" ADD CONSTRAINT "REL_9ff3f6733494645af3a5bd0cc7" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" ADD CONSTRAINT "FK_9ff3f6733494645af3a5bd0cc7d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // Remover user_discount_id de transactions
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "FK_transactions_user_discount"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transactions_user_discount_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN IF EXISTS "user_discount_id"`,
    );

    // Remover columnas desnormalizadas de monto en transactions
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN IF EXISTS "amount_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN IF EXISTS "amount_value"`,
    );

    // Restaurar payments_id en transactions y sus constraints
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "payments_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "REL_cdee4818a64ef6555829c23f51" UNIQUE ("payments_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_cdee4818a64ef6555829c23f519" FOREIGN KEY ("payments_id") REFERENCES "proof_of_payments"("payments_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Quitar FK e índice de proof_of_payments.transaction_id y eliminar columna
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" DROP CONSTRAINT IF EXISTS "FK_proof_payments_transaction"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_proof_of_payments_transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" DROP COLUMN IF EXISTS "transaction_id"`,
    );
  }
}
