import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { valid: false, message: 'API key is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Query the api_keys table to check if the key exists
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_value')
      .eq('key_value', key)
      .single();

    if (error) {
      console.log('[validate] Key not found or error:', error?.message);
      return NextResponse.json(
        { valid: false, message: 'Invalid API key' },
        { status: 200 }
      );
    }

    if (!data) {
      console.log('[validate] Key not found');
      return NextResponse.json(
        { valid: false, message: 'Invalid API key' },
        { status: 200 }
      );
    }

    // Key exists in database
    console.log('[validate] Valid key found:', data.name);
    return NextResponse.json(
      { 
        valid: true, 
        message: 'API key is valid',
        keyName: data.name
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[validate] Unexpected error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        message: 'Validation error occurred'
      },
      { status: 500 }
    );
  }
}

