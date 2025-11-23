# Vibe Coding Starter

Modern Next.js starter with an API-key dashboard powered by Supabase.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   The service role key is only used on the server (inside `/app/api/keys/route.ts`) for full CRUD access.
3. Define the `api_keys` table in Supabase:
   - Go to: https://app.supabase.com/project/_/sql
   - Run this SQL (or use `supabase-schema.sql` file):
   ```sql
   CREATE TABLE IF NOT EXISTS api_keys (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     usage INTEGER DEFAULT 0,
     key_value TEXT NOT NULL,
     monthly_limit INTEGER,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create index for faster lookups
   CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

   -- Enable Row Level Security
   ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

   -- Allow service role to perform all operations
   CREATE POLICY "Allow all operations for service role"
     ON api_keys
     FOR ALL
     USING (true)
     WITH CHECK (true);
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Available scripts

| Command        | Description                      |
| -------------- | -------------------------------- |
| `npm run dev`  | Start Next.js in dev mode        |
| `npm run build`| Create a production build        |
| `npm start`    | Serve the production build       |
| `npm run lint` | Run ESLint on the entire project |


