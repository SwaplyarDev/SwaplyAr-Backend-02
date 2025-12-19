require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='otp_codes' ORDER BY ordinal_position");
    console.log('columns for otp_codes:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('error querying db:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
