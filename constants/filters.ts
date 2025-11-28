import { FilterIcons, getFilterIcon } from './icons';
import type { LucideIcon } from 'lucide-react-native';

export interface Filter {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const DEFAULT_FILTERS: Filter[] = [
  { id: 'gym', label: 'Gym', icon: FilterIcons.gym },
  { id: 'yoga', label: 'Yoga', icon: FilterIcons.yoga },
  { id: 'crossfit', label: 'CrossFit', icon: FilterIcons.crossfit },
  { id: 'cycling', label: 'Cycling', icon: FilterIcons.cycling },
  { id: 'boxing', label: 'Boxing', icon: FilterIcons.boxing },
  { id: 'sauna', label: 'Sauna', icon: FilterIcons.sauna },
  { id: 'pool', label: 'Pool', icon: FilterIcons.pool },
  { id: '24hr', label: '24hr', icon: FilterIcons['24hr'] },
];

export { getFilterIcon };

export const FACILITY_TYPES = {
  gym: 'Gym',
  yoga_studio: 'Yoga Studio',
  pilates_studio: 'Pilates Studio',
  crossfit_gym: 'CrossFit',
  boxing_gym: 'Boxing',
  cycling_studio: 'Cycling',
  swimming_pool: 'Swimming Pool',
  martial_arts: 'Martial Arts',
};
