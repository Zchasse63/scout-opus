import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Gym } from '../../types';
import { colors } from '../../constants/colors';

interface GymMapProps {
  gyms: Gym[];
  selectedGymId?: string;
  onGymPress: (gymId: string) => void;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function GymMap({
  gyms,
  selectedGymId,
  onGymPress,
  region,
}: GymMapProps) {
  const mapRef = useRef<MapView>(null);

  // Default region (Miami)
  const defaultRegion = {
    latitude: 25.7617,
    longitude: -80.1918,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const displayRegion = region || defaultRegion;

  useEffect(() => {
    if (mapRef.current && gyms.length > 0) {
      mapRef.current.fitToElements({ animated: true });
    }
  }, [gyms]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={displayRegion}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      >
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={{
              latitude: gym.latitude,
              longitude: gym.longitude,
            }}
            title={gym.name}
            description={gym.address}
            onPress={() => onGymPress(gym.id)}
            pinColor={
              selectedGymId === gym.id ? colors.primary : colors.gray400
            }
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
