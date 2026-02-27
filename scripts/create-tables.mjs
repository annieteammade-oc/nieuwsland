import pg from 'pg';
const { Client } = pg;
const c = new Client(process.env.DATABASE_URL);
await c.connect();
await c.query(`
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    subscribed_at timestamptz DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
`);
console.log('Tables created OK');
await c.end();
