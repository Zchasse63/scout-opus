import { create } from 'zustand';
import type { MapRegion } from '../types';

interface MapStore {
  viewMode: 'list' | 'map';
  region: MapRegion | null;
  selectedGymId: string | null;
  setViewMode: (mode: 'list' | 'map') => void;
  setRegion: (region: MapRegion) => void;
  setSelectedGym: (id: string | null) => void;
}

const DEFAULT_REGION: MapRegion = {
  latitude: 25.7617, // Miami default
  longitude: -80.1918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const useMapStore = create<MapStore>((set) => ({
  viewMode: 'list',
  region: DEFAULT_REGION,
  selectedGymId: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setRegion: (region) => set({ region }),
  setSelectedGym: (id) => set({ selectedGymId: id }),
}));
