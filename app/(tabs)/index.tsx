import { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGymSearch } from '../../hooks/useGymSearch';
import { useMapStore } from '../../stores/mapStore';
import { useSavedGyms } from '../../hooks/useSavedGyms';
import { colors } from '../../constants/colors';
import SearchTray from '../../components/search/SearchTray';
import GymCard from '../../components/explore/GymCard';
import ViewToggleFAB from '../../components/explore/ViewToggleFAB';
import GymMap from '../../components/explore/GymMap';

export default function ExploreTab() {
  const router = useRouter();
  const { setSearchQuery, results, isLoading } = useGymSearch();
  const { viewMode, setViewMode } = useMapStore();
  const { isSaved, toggleSave } = useSavedGyms();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleGymPress = useCallback((gymId: string) => {
    router.push(`/gym/${gymId}`);
  }, [router]);

  const handleViewToggle = useCallback(() => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  }, [viewMode, setViewMode]);

  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 'list' ? (
        // List View
        <View style={styles.listContainer}>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <GymCard
                gym={item}
                onPress={handleGymPress}
                onSaveToggle={toggleSave}
                isSaved={isSaved(item.id)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              isLoading ? (
                <View style={styles.centerContent}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : (
                <View style={styles.centerContent}>
                  <View />
                </View>
              )
            }
            contentContainerStyle={styles.listContent}
          />
          <SearchTray onSearch={handleSearch} />
          <ViewToggleFAB viewMode={viewMode} onToggle={handleViewToggle} />
        </View>
      ) : (
        // Map View
        <View style={styles.mapContainer}>
          <GymMap
            gyms={results}
            onGymPress={handleGymPress}
          />
          <SearchTray onSearch={handleSearch} />
          <ViewToggleFAB viewMode={viewMode} onToggle={handleViewToggle} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 200,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
});
