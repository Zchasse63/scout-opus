import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxepvxrpkaehqkujzzqn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZXB2eHJwa2FlaHFrdWp6enFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODg0NzIsImV4cCI6MjA3OTY2NDQ3Mn0.kmEDfcbu570RnKprUje9a_HdYYzTOZ8dLGtDzDcKMd4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
