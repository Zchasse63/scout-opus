import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AdminUser } from '../types';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
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
        // Check if user is admin
        const isAdmin = data.user.user_metadata?.role === 'admin' ||
                       data.user.user_metadata?.is_admin === true;

        if (!isAdmin) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized: Admin access required');
        }

        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata?.role || 'admin',
          created_at: data.user.created_at,
        };

        set({
          user: adminUser,
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
        // Check if user is admin
        const isAdmin = session.user.user_metadata?.role === 'admin' ||
                       session.user.user_metadata?.is_admin === true;

        if (!isAdmin) {
          await supabase.auth.signOut();
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'admin',
          created_at: session.user.created_at,
        };

        set({
          user: adminUser,
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
}));

// Subscribe to auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.getState().logout();
  } else if (event === 'SIGNED_IN' && session) {
    useAuthStore.getState().checkAuth();
  }
});
