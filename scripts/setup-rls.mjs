import pg from 'pg';
const { Client } = pg;
const c = new Client(process.env.DATABASE_URL);
await c.connect();
await c.query(`
  ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "allow_anon_insert_newsletter" ON newsletter_subscribers;
  CREATE POLICY "allow_anon_insert_newsletter" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
  
  DROP POLICY IF EXISTS "allow_anon_insert_contact" ON contact_messages;
  CREATE POLICY "allow_anon_insert_contact" ON contact_messages FOR INSERT TO anon WITH CHECK (true);
  
  DROP POLICY IF EXISTS "allow_service_select_newsletter" ON newsletter_subscribers;
  CREATE POLICY "allow_service_select_newsletter" ON newsletter_subscribers FOR SELECT TO service_role USING (true);
  
  DROP POLICY IF EXISTS "allow_service_select_contact" ON contact_messages;
  CREATE POLICY "allow_service_select_contact" ON contact_messages FOR SELECT TO service_role USING (true);
`);
console.log('RLS policies OK');
await c.end();
