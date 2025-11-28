/**
 * Favorites Screen - Saved gyms list with map view option
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Map, List, Heart, FolderPlus } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import GymCard from '../../components/explore/GymCard';
import { EmptyState } from '../../components/ui/EmptyState';
// import { useFavoritesStore } from '../../stores/favoritesStore'; // TODO: Create store

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock gym data for favorites
const mockFavoriteGyms = [
  { id: '1', name: 'Equinox DTLA', address: '123 Main St, Los Angeles', rating: 4.8, dayPassPrice: 35, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', latitude: 34.0522, longitude: -118.2437, amenities: ['Pool', 'Sauna'], hours: { monday: '5:00 AM - 11:00 PM' }, photos: [], description: '', reviewCount: 120 },
  { id: '2', name: 'Gold\'s Gym Venice', address: '1006 Pacific Ave, Venice', rating: 4.6, dayPassPrice: 20, imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', latitude: 33.9850, longitude: -118.4695, amenities: ['Free Weights'], hours: { monday: '6:00 AM - 10:00 PM' }, photos: [], description: '', reviewCount: 85 },
  { id: '3', name: 'Barry\'s Bootcamp', address: '456 Sunset Blvd, Hollywood', rating: 4.9, dayPassPrice: 45, imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400', latitude: 34.0928, longitude: -118.3287, amenities: ['Classes'], hours: { monday: '5:30 AM - 9:00 PM' }, photos: [], description: '', reviewCount: 200 },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  // const { favorites } = useFavoritesStore(); // TODO: Create store
  const favorites: string[] = [];

  // Use mock data for now
  const favoriteGyms = mockFavoriteGyms;
  const isEmpty = favoriteGyms.length === 0;

  const handleGymPress = (gymId: string) => {
    haptics.light();
    router.push(`/gym/${gymId}`);
  };

  const renderGymCard = ({ item }: { item: typeof mockFavoriteGyms[0] }) => (
    <GymCard
      gym={{
        id: item.id,
        name: item.name,
        address: item.address,
        rating: item.rating,
        dayPassPrice: item.dayPassPrice,
        latitude: item.latitude,
        longitude: item.longitude,
        amenities: item.amenities,
        hours: item.hours,
        photos: item.photos,
        description: item.description,
        reviewCount: item.reviewCount,
      }}
      onPress={() => handleGymPress(item.id)}
      isSaved={true}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Gyms</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/favorites/lists')} style={styles.actionButton}>
            <FolderPlus size={iconSizes.md} color={colors.gray700} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { haptics.light(); setViewMode(viewMode === 'list' ? 'map' : 'list'); }}
            style={styles.actionButton}
          >
            {viewMode === 'list' ? (
              <Map size={iconSizes.md} color={colors.gray700} />
            ) : (
              <List size={iconSizes.md} color={colors.gray700} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isEmpty ? (
        <EmptyState
          icon="heart"
          title="No Saved Gyms Yet"
          description="Tap the heart icon on any gym to save it here for quick access."
          actionLabel="Explore Gyms"
          onAction={() => router.push('/(tabs)')}
        />
      ) : viewMode === 'list' ? (
        <FlatList
          data={favoriteGyms}
          renderItem={renderGymCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 34.0522,
            longitude: -118.2437,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {favoriteGyms.map((gym) => (
            <Marker
              key={gym.id}
              coordinate={{ latitude: gym.latitude, longitude: gym.longitude }}
              title={gym.name}
              description={`$${gym.dayPassPrice}/day`}
              onPress={() => handleGymPress(gym.id)}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { padding: spacing.xs },
  listContent: { padding: padding.screenHorizontal, gap: spacing.md },
  map: { flex: 1 },
});

