import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && (supabaseKey || supabaseServiceKey));
};

// Create Supabase client only if configured
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(
    supabaseUrl,
    supabaseServiceKey || supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  console.log('✅ Supabase client initialized');
} else {
  console.log('⚠️  Supabase credentials not found. Using in-memory data store.');
}

export const supabase: SupabaseClient = supabaseInstance as SupabaseClient;

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabaseInstance) {
    return false;
  }

  try {
    const { data, error } = await supabaseInstance.from('shipments').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

export default supabase;
