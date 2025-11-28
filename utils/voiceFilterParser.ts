/**
 * Voice Filter Parser - Parses voice commands into filter parameters
 */

export interface ParsedFilters {
  priceMax?: number;
  distance?: number;
  rating?: number;
  amenities?: string[];
  gymTypes?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  openNow?: boolean;
  location?: string;
}

// Amenity keywords mapping
const AMENITY_KEYWORDS: Record<string, string[]> = {
  pool: ['pool', 'swimming', 'swim'],
  sauna: ['sauna', 'steam', 'steam room'],
  classes: ['classes', 'group classes', 'fitness classes'],
  towels: ['towels', 'towel service'],
  lockers: ['lockers', 'locker'],
  parking: ['parking', 'free parking'],
  showers: ['showers', 'shower'],
  wifi: ['wifi', 'wi-fi', 'internet'],
  spa: ['spa', 'massage'],
  basketball: ['basketball', 'basketball court'],
  tennis: ['tennis', 'tennis court'],
};

// Gym type keywords
const GYM_TYPE_KEYWORDS: Record<string, string[]> = {
  traditional: ['gym', 'fitness center', 'health club'],
  crossfit: ['crossfit', 'cross fit', 'functional training'],
  yoga: ['yoga', 'yoga studio', 'hot yoga'],
  pilates: ['pilates'],
  cycling: ['cycling', 'spin', 'spinning'],
  hiit: ['hiit', 'high intensity', 'circuit training'],
  climbing: ['climbing', 'rock climbing', 'bouldering'],
  boxing: ['boxing', 'kickboxing', 'mma'],
};

// Time of day patterns
const TIME_PATTERNS = {
  morning: /\b(morning|early|am|before work|6am|7am|8am|9am)\b/i,
  afternoon: /\b(afternoon|lunch|midday|noon|12pm|1pm|2pm|3pm)\b/i,
  evening: /\b(evening|after work|night|pm|5pm|6pm|7pm|8pm|9pm)\b/i,
  night: /\b(late night|24.?hour|24.?7|midnight|overnight)\b/i,
};

/**
 * Parse a voice transcript into filter parameters
 */
export function parseVoiceFilters(transcript: string): ParsedFilters {
  const result: ParsedFilters = {};
  const lower = transcript.toLowerCase();

  // Parse price - "under $20", "less than 30 dollars", "cheap"
  const priceMatch = lower.match(/(?:under|less than|below|max|maximum|up to)\s*\$?(\d+)/);
  if (priceMatch) {
    result.priceMax = parseInt(priceMatch[1], 10);
  } else if (lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable')) {
    result.priceMax = 20;
  } else if (lower.includes('expensive') || lower.includes('premium') || lower.includes('luxury')) {
    result.priceMax = 100;
  }

  // Parse distance - "within 5 miles", "near me", "close by"
  const distanceMatch = lower.match(/(?:within|less than|under)\s*(\d+)\s*(?:miles?|mi)/);
  if (distanceMatch) {
    result.distance = parseInt(distanceMatch[1], 10);
  } else if (lower.includes('near me') || lower.includes('nearby') || lower.includes('close')) {
    result.distance = 2;
  } else if (lower.includes('walking distance')) {
    result.distance = 1;
  }

  // Parse rating - "4 stars", "highly rated", "top rated"
  const ratingMatch = lower.match(/(\d(?:\.\d)?)\s*(?:stars?|rating)/);
  if (ratingMatch) {
    result.rating = parseFloat(ratingMatch[1]);
  } else if (lower.includes('top rated') || lower.includes('best') || lower.includes('highly rated')) {
    result.rating = 4.5;
  } else if (lower.includes('good')) {
    result.rating = 4.0;
  }

  // Parse amenities
  const amenities: string[] = [];
  for (const [amenityId, keywords] of Object.entries(AMENITY_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      amenities.push(amenityId);
    }
  }
  if (amenities.length > 0) {
    result.amenities = amenities;
  }

  // Parse gym types
  const gymTypes: string[] = [];
  for (const [typeId, keywords] of Object.entries(GYM_TYPE_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      gymTypes.push(typeId);
    }
  }
  if (gymTypes.length > 0) {
    result.gymTypes = gymTypes;
  }

  // Parse time of day
  for (const [timeOfDay, pattern] of Object.entries(TIME_PATTERNS)) {
    if (pattern.test(lower)) {
      result.timeOfDay = timeOfDay as ParsedFilters['timeOfDay'];
      break;
    }
  }

  // Parse open now
  if (lower.includes('open now') || lower.includes('open right now') || lower.includes('currently open')) {
    result.openNow = true;
  }

  // Parse location - "near downtown", "in miami", "around central park"
  const locationMatch = lower.match(/(?:near|in|around|at)\s+([a-zA-Z\s]+?)(?:\s+(?:gym|gyms|fitness|under|with|that|open)|$)/);
  if (locationMatch && locationMatch[1].trim().length > 2) {
    result.location = locationMatch[1].trim();
  }

  return result;
}

/**
 * Convert parsed filters to human-readable summary
 */
export function filtersToSummary(filters: ParsedFilters): string {
  const parts: string[] = [];

  if (filters.priceMax) parts.push(`under $${filters.priceMax}`);
  if (filters.distance) parts.push(`within ${filters.distance} miles`);
  if (filters.rating) parts.push(`${filters.rating}+ stars`);
  if (filters.amenities?.length) parts.push(`with ${filters.amenities.join(', ')}`);
  if (filters.gymTypes?.length) parts.push(filters.gymTypes.join(', '));
  if (filters.timeOfDay) parts.push(`open ${filters.timeOfDay}`);
  if (filters.openNow) parts.push('open now');
  if (filters.location) parts.push(`near ${filters.location}`);

  return parts.join(', ') || 'all gyms';
}

export default { parseVoiceFilters, filtersToSummary };

