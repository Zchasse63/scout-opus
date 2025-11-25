import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { TravelPeriod } from '../types';

interface TravelPeriodRow {
  id: string;
  user_id: string;
  destination_city: string;
  destination_state: string;
  destination_country: string;
  destination_lat: number;
  destination_lng: number;
  start_date: string;
  end_date: string;
  confidence_score: number;
  source: 'ios_calendar' | 'google_calendar' | 'manual';
  source_event_id: string | null;
}

async function fetchUserTrips(): Promise<TravelPeriod[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('travel_periods')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch trips: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Transform database rows to TravelPeriod type
  return data.map((row: TravelPeriodRow) => ({
    id: row.id,
    userId: row.user_id,
    destinationCity: row.destination_city,
    destinationState: row.destination_state,
    destinationCountry: row.destination_country,
    destinationLat: row.destination_lat,
    destinationLng: row.destination_lng,
    startDate: row.start_date,
    endDate: row.end_date,
    confidenceScore: row.confidence_score,
    source: row.source,
    sourceEventId: row.source_event_id ?? undefined,
  }));
}

interface CreateTripInput {
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationLat: number;
  destinationLng: number;
  startDate: string;
  endDate: string;
  confidenceScore?: number;
  source?: 'ios_calendar' | 'google_calendar' | 'manual';
  sourceEventId?: string;
}

async function createTrip(input: CreateTripInput): Promise<TravelPeriod> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('travel_periods')
    .insert({
      user_id: user.id,
      destination_city: input.destinationCity,
      destination_state: input.destinationState,
      destination_country: input.destinationCountry,
      destination_lat: input.destinationLat,
      destination_lng: input.destinationLng,
      start_date: input.startDate,
      end_date: input.endDate,
      confidence_score: input.confidenceScore ?? 1.0,
      source: input.source ?? 'manual',
      source_event_id: input.sourceEventId ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create trip: ${error.message}`);
  }

  const row = data as TravelPeriodRow;

  return {
    id: row.id,
    userId: row.user_id,
    destinationCity: row.destination_city,
    destinationState: row.destination_state,
    destinationCountry: row.destination_country,
    destinationLat: row.destination_lat,
    destinationLng: row.destination_lng,
    startDate: row.start_date,
    endDate: row.end_date,
    confidenceScore: row.confidence_score,
    source: row.source,
    sourceEventId: row.source_event_id ?? undefined,
  };
}

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: fetchUserTrips,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
