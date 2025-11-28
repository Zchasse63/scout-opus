/**
 * LocationPicker - Where section of structured search
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Navigation, Clock, Search } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'current' | 'recent' | 'popular' | 'search';
  subtitle?: string;
}

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

const POPULAR_LOCATIONS = [
  { id: '1', name: 'Miami Beach', type: 'popular' as const, subtitle: 'Florida' },
  { id: '2', name: 'Downtown Los Angeles', type: 'popular' as const, subtitle: 'California' },
  { id: '3', name: 'Manhattan', type: 'popular' as const, subtitle: 'New York' },
  { id: '4', name: 'Austin', type: 'popular' as const, subtitle: 'Texas' },
];

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [searchText, setSearchText] = useState(value);
  const [recentLocations] = useState<LocationSuggestion[]>([
    { id: 'r1', name: 'Downtown Miami', type: 'recent', subtitle: 'Last searched' },
  ]);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleSelect = (location: LocationSuggestion) => {
    haptics.selection();
    setSearchText(location.name);
    onChange(location.name);
  };

  const handleUseCurrentLocation = () => {
    haptics.light();
    setSearchText('Current Location');
    onChange('Current Location');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Where</Text>
      <Text style={styles.sectionSubtitle}>Search destinations</Text>

      <View style={styles.inputContainer}>
        <Search size={iconSizes.sm} color={colors.gray500} />
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onChange(text);
          }}
          placeholder="Search cities, neighborhoods..."
          placeholderTextColor={colors.gray500}
        />
      </View>

      <TouchableOpacity style={styles.currentLocation} onPress={handleUseCurrentLocation}>
        <View style={styles.iconContainer}>
          <Navigation size={iconSizes.md} color={colors.primary} />
        </View>
        <Text style={styles.currentLocationText}>Use my current location</Text>
      </TouchableOpacity>

      {recentLocations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.listTitle}>Recent</Text>
          {recentLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationItem}
              onPress={() => handleSelect(location)}
            >
              <View style={styles.iconContainer}>
                <Clock size={iconSizes.sm} color={colors.gray500} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                {location.subtitle && (
                  <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.listTitle}>Popular</Text>
        {POPULAR_LOCATIONS.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={styles.locationItem}
            onPress={() => handleSelect(location)}
          >
            <View style={styles.iconContainer}>
              <MapPin size={iconSizes.sm} color={colors.gray500} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              {location.subtitle && (
                <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { ...typography.h2, color: colors.black, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.body, color: colors.gray600, marginBottom: spacing.lg },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: { flex: 1, ...typography.body, paddingVertical: spacing.md, color: colors.black },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  currentLocationText: { ...typography.bodyBold, color: colors.primary },
  section: { marginTop: spacing.lg },
  listTitle: { ...typography.smallBold, color: colors.gray600, marginBottom: spacing.md },
  locationItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm,
  },
  locationInfo: { flex: 1 },
  locationName: { ...typography.body, color: colors.black },
  locationSubtitle: { ...typography.small, color: colors.gray500 },
});

export default LocationPicker;

