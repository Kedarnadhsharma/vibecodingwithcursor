import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

import { getSupabase } from '../../../lib/supabase';

type ApiKeyRow = {
  id: string;
  name: string;
  usage: number | null;
  key_value: string;
  monthly_limit: number | null;
};

const TABLE = 'api_keys';

const mapRow = (row: ApiKeyRow) => ({
  id: row.id,
  name: row.name,
  usage: row.usage ?? 0,
  key: row.key_value,
  limit: row.monthly_limit
});

const createMask = () => {
  const random = randomBytes(12).toString('hex');
  return `tvly-${random}`.slice(0, 24).padEnd(32, '*');
};

export async function GET() {
  try {
    console.log('[GET /api/keys] Starting fetch');
    console.log('[GET /api/keys] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('[GET /api/keys] SUPABASE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ANON SET' : 'NOT SET'));
    
    const supabase = getSupabase();
    console.log('[GET /api/keys] Supabase client created');
    
    const { data, error } = await supabase
      .from(TABLE)
      .select('id,name,usage,key_value,monthly_limit')
      .order('name', { ascending: true });

    if (error) {
      console.error('[GET /api/keys] Supabase error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const rows = (data as ApiKeyRow[] | null) ?? [];
    console.log(`[GET /api/keys] Fetched ${rows.length} keys`);
    return NextResponse.json(rows.map(mapRow));
  } catch (err) {
    console.error('[GET /api/keys] Caught exception:', err);
    return NextResponse.json({ 
      message: (err as Error).message,
      error: String(err)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[POST /api/keys] Request body:', body);

    if (!body?.name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    console.log('[POST /api/keys] Supabase client initialized');

    const payload = {
      name: body.name,
      usage: 0,
      key_value: createMask(),
      monthly_limit: body.limit ?? null
    };
    console.log('[POST /api/keys] Inserting payload:', payload);

    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('id,name,usage,key_value,monthly_limit')
      .single();

    if (error) {
      console.error('[POST /api/keys] Supabase error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.log('[POST /api/keys] Success, data:', data);
    const result = mapRow(data as ApiKeyRow);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[POST /api/keys] Caught exception:', err);
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    console.log('[DELETE /api/keys] Request body:', body);

    if (!body?.id) {
      return NextResponse.json({ message: 'Key id is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from(TABLE).delete().eq('id', body.id);

    if (error) {
      console.error('[DELETE /api/keys] Supabase error:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.log('[DELETE /api/keys] Success, deleted id:', body.id);
    return NextResponse.json({ id: body.id });
  } catch (err) {
    console.error('[DELETE /api/keys] Caught exception:', err);
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}

