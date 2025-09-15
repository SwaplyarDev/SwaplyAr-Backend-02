/* eslint-disable no-console */
const { Client } = require('pg');

(async () => {
  try {
    const conn = process.env.DATABASE_URL || process.env.DATABASE_TEST_URL;
    if (!conn) {
      console.error('DATABASE_URL o DATABASE_TEST_URL no están definidos');
      process.exit(1);
    }
    const c = new Client({ connectionString: conn });
    await c.connect();

    const idxNames = [
      'idx_proof_of_payments_created_at',
      'idx_proof_of_payments_tx_created_at',
      'idx_payment_methods_method',
      'idx_payment_methods_platform_method',
      'idx_pix_virtual_bank_id',
      'idx_pix_key',
      'idx_pix_cpf',
      'idx_financial_accounts_first_name',
      'idx_financial_accounts_last_name',
      'idx_financial_accounts_name',
      'idx_sender_fin_accounts_created_by',
      'idx_sender_fin_accounts_phone',
    ];

    const idx = await c.query(
      `SELECT indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND indexname = ANY($1) ORDER BY indexname`,
      [idxNames]
    );
    console.log('Indexes encontrados:', idx.rowCount);
    for (const r of idx.rows) {
      console.log('-', r.indexname, '\n  ', r.indexdef);
    }

    const uq = await c.query(
      `SELECT conname, pg_get_constraintdef(c.oid) AS def
       FROM pg_constraint c
       JOIN pg_namespace n ON n.oid=c.connamespace
       WHERE n.nspname='public' AND c.contype='u' AND conname='UQ_08546893edd711eb732b066959d'`
    );
    console.log('\nConstraint único PIX key:', uq.rowCount);
    for (const r of uq.rows) {
      console.log('-', r.conname, '\n  ', r.def);
    }

    await c.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
