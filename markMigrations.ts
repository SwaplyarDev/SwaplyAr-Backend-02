import { Client } from 'pg';

async function markMigrations() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_Lv7cKTI9obkX@ep-sweet-hat-actuqnhf-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  });
  await client.connect();

  await client.query(`
    INSERT INTO migrations ("timestamp", "name") VALUES
    (1750000001000, 'CreateEnums1750000001000'),
    (1750000002000, 'CreateUserAccount1750000002000'),
    (1750000003000, 'CreateTransactions1750000003000'),
    (1750000004000, 'CreateNotes1750000004000')
  `);

  console.log('Migrations marked as applied.');
  await client.end();
}

markMigrations().catch(console.error);
