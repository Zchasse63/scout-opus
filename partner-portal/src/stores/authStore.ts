import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Partner } from '../types';

interface AuthState {
  user: any | null;
  partner: Partner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setPartner: (partner: Partner | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  partner: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch partner profile
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (partnerError) {
          // User is not a partner
          await supabase.auth.signOut();
          throw new Error('Account not found. Please contact support if you believe this is an error.');
        }

        set({
          user: data.user,
          partner: partnerData,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        partner: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch partner profile
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (partnerError || !partnerData) {
          await supabase.auth.signOut();
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({
          user: session.user,
          partner: partnerData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  setPartner: (partner: Partner | null) => {
    set({ partner });
  },
}));

// Subscribe to auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.getState().logout();
  } else if (event === 'SIGNED_IN' && session) {
    useAuthStore.getState().checkAuth();
  }
});
