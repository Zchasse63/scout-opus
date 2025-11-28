import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Navigation, RefreshCw } from 'lucide-react-native';
import { Gym } from '../../types';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { PriceBubbleMarker } from './PriceBubbleMarker';

interface GymMapProps {
  gyms: Gym[];
  selectedGymId?: string;
  onGymPress: (gymId: string) => void;
  onRegionChange?: (region: Region) => void;
  onSearchArea?: (region: Region) => void;
  region?: Region;
}

export default function GymMap({
  gyms,
  selectedGymId,
  onGymPress,
  onRegionChange,
  onSearchArea,
  region,
}: GymMapProps) {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);

  // Get user location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  // Default region - use user location if available
  const defaultRegion: Region = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: 25.7617, longitude: -80.1918, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };

  const displayRegion = region || defaultRegion;

  useEffect(() => {
    if (mapRef.current && gyms.length > 0 && !region) {
      mapRef.current.fitToElements({ animated: true });
    }
  }, [gyms, region]);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setCurrentRegion(newRegion);
    setShowSearchButton(true);
    onRegionChange?.(newRegion);
  }, [onRegionChange]);

  const handleSearchArea = useCallback(() => {
    haptics.light();
    if (currentRegion && onSearchArea) {
      onSearchArea(currentRegion);
      setShowSearchButton(false);
    }
  }, [currentRegion, onSearchArea]);

  const centerOnUser = useCallback(() => {
    haptics.light();
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={displayRegion}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={{ latitude: gym.latitude, longitude: gym.longitude }}
            onPress={() => { haptics.selection(); onGymPress(gym.id); }}
          >
            <PriceBubbleMarker
              price={gym.dayPassPrice}
              rating={gym.rating}
              isSelected={selectedGymId === gym.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* Search this area button */}
      {showSearchButton && onSearchArea && (
        <TouchableOpacity style={styles.searchAreaButton} onPress={handleSearchArea}>
          <RefreshCw size={iconSizes.sm} color={colors.black} />
          <Text style={styles.searchAreaText}>Search this area</Text>
        </TouchableOpacity>
      )}

      {/* Center on user button */}
      {userLocation && (
        <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
          <Navigation size={iconSizes.md} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchAreaButton: {
    position: 'absolute',
    top: spacing.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchAreaText: { ...typography.smallBold, color: colors.black },
  centerButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.full,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
