import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface SavedGymRow {
  id: string;
  user_id: string;
  gym_id: string;
  created_at: string;
}

interface SavedGym {
  id: string;
  userId: string;
  gymId: string;
  createdAt: string;
}

async function fetchSavedGyms(): Promise<SavedGym[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('saved_gyms')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch saved gyms: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Transform to camelCase
  return data.map((row: SavedGymRow) => ({
    id: row.id,
    userId: row.user_id,
    gymId: row.gym_id,
    createdAt: row.created_at,
  }));
}

async function saveGym(gymId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from('saved_gyms').insert({
    user_id: user.id,
    gym_id: gymId,
  });

  if (error) {
    throw new Error(`Failed to save gym: ${error.message}`);
  }
}

async function unsaveGym(gymId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('saved_gyms')
    .delete()
    .eq('user_id', user.id)
    .eq('gym_id', gymId);

  if (error) {
    throw new Error(`Failed to unsave gym: ${error.message}`);
  }
}

export function useSavedGyms() {
  const queryClient = useQueryClient();

  // Fetch saved gyms
  const { data: savedGyms = [], isLoading } = useQuery({
    queryKey: ['saved-gyms'],
    queryFn: fetchSavedGyms,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Derive savedGymIds from savedGyms using useMemo (no useState/useEffect loop)
  const savedGymIds = useMemo(
    () => new Set(savedGyms.map((g) => g.gymId)),
    [savedGyms]
  );

  // Save gym
  const saveMutation = useMutation({
    mutationFn: saveGym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-gyms'] });
    },
  });

  // Unsave gym
  const unsaveMutation = useMutation({
    mutationFn: unsaveGym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-gyms'] });
    },
  });

  const toggleSave = useCallback(
    async (gymId: string) => {
      if (savedGymIds.has(gymId)) {
        await unsaveMutation.mutateAsync(gymId);
      } else {
        await saveMutation.mutateAsync(gymId);
      }
    },
    [savedGymIds, saveMutation, unsaveMutation]
  );

  const isSaved = useCallback((gymId: string) => savedGymIds.has(gymId), [savedGymIds]);

  return {
    savedGyms,
    isLoading,
    isSaved,
    toggleSave,
    isToggling: saveMutation.isPending || unsaveMutation.isPending,
  };
}
