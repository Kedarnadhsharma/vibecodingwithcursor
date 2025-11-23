-- Create the api_keys table in Supabase
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Drop table if it exists (optional - only if you want to start fresh)
-- DROP TABLE IF EXISTS api_keys;

-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  usage INTEGER DEFAULT 0,
  key_value TEXT NOT NULL,
  monthly_limit INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations with service role key
-- This allows your API routes to perform CRUD operations
CREATE POLICY "Allow all operations for service role"
  ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create policy for authenticated users (if you add auth later)
-- CREATE POLICY "Allow authenticated users to manage their keys"
--   ON api_keys
--   FOR ALL
--   USING (auth.uid() IS NOT NULL)
--   WITH CHECK (auth.uid() IS NOT NULL);

