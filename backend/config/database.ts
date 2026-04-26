import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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
    console.log('⚠️ Supabase not configured, skipping connection test');
    return false;
  }

  try {
    // Correct way to check for table existence and connectivity in Supabase
    const { error } = await supabaseInstance.from('shipments').select('*', { count: 'exact', head: true }).limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

export default supabase;
