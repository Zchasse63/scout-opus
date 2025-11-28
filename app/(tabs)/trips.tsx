import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Dumbbell, Plus, ChevronRight, Cloud, Trash2 } from 'lucide-react-native';
import { useTripsStore } from '../../stores/tripsStore';
import { useTrips } from '../../hooks/useTrips';
import { syncCalendarToTrips } from '../../services/calendar';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { TravelPeriod } from '../../types';
import { haptics } from '../../utils/haptics';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

// City images for common destinations
const CITY_IMAGES: Record<string, string> = {
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400',
  'Miami': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400',
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
  'Chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400',
  'default': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
};

interface TripSection {
  title: string;
  data: TravelPeriod[];
}

export default function TripsTab() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: trips, isLoading: isLoadingTrips, error } = useTrips();
  const [isSyncing, setIsSyncing] = useState(false);
  const { setTrips } = useTripsStore();

  const today = new Date().toISOString().split('T')[0];

  // Categorize trips
  const upcomingTrips = trips?.filter((t) => t.startDate > today) || [];
  const activeTrips = trips?.filter((t) => t.startDate <= today && t.endDate >= today) || [];
  const pastTrips = trips?.filter((t) => t.endDate < today) || [];

  const sections: TripSection[] = [
    { title: 'Active Now', data: activeTrips },
    { title: 'Upcoming', data: upcomingTrips },
    { title: 'Past', data: pastTrips },
  ].filter((s) => s.data.length > 0);

  // Load trips on mount
  useEffect(() => {
    setTrips(upcomingTrips, pastTrips);
  }, [setTrips]);

  const handleSyncCalendar = useCallback(async () => {
    haptics.light();
    setIsSyncing(true);
    try {
      const count = await syncCalendarToTrips();
      queryClient.invalidateQueries({ queryKey: ['trips'] });

      if (count > 0) {
        haptics.success();
        Alert.alert('Calendar Synced', `Found ${count} trip${count === 1 ? '' : 's'} from your calendar.`);
      } else {
        Alert.alert('No Trips Found', 'No travel events were detected in your calendar.');
      }
    } catch (error) {
      haptics.error();
      Alert.alert('Sync Failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient]);

  const handleCreateTrip = useCallback(() => {
    haptics.light();
    router.push('/trips/create' as any);
  }, [router]);

  const handleDeleteTrip = useCallback((tripId: string) => {
    haptics.warning();
    Alert.alert('Delete Trip', 'Are you sure you want to remove this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        // TODO: Implement delete via store/API
        haptics.medium();
      }},
    ]);
  }, []);

  const renderTripCard = ({ item: trip }: { item: TravelPeriod }) => (
    <EnhancedTripCard trip={trip} onDelete={() => handleDeleteTrip(trip.id)} />
  );

  const renderSectionHeader = ({ section }: { section: TripSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <EmptyState
        icon="plane"
        title="No Trips Planned"
        description="Sync your calendar or add a trip manually to find gyms during your travels"
      />
      <View style={styles.emptyActions}>
        <TouchableOpacity style={styles.syncButton} onPress={handleSyncCalendar} disabled={isSyncing}>
          {isSyncing ? <ActivityIndicator color={colors.white} /> : (
            <>
              <Calendar size={iconSizes.md} color={colors.white} />
              <Text style={styles.syncButtonText}>Sync Calendar</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addTripButton} onPress={handleCreateTrip}>
          <Plus size={iconSizes.md} color={colors.primary} />
          <Text style={styles.addTripButtonText}>Add Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Show loading state with skeleton
  if (isLoadingTrips) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>My Trips</Text>
            <Text style={styles.subtitle}>Find gyms during your travels</Text>
          </View>
        </View>
        <View style={styles.listContent}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.card}>
              <Skeleton width="100%" height={120} />
              <View style={{ padding: spacing.lg }}>
                <Skeleton width={150} height={20} />
                <Skeleton width={200} height={16} style={{ marginTop: spacing.sm }} />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>My Trips</Text>
            <Text style={styles.subtitle}>Find gyms during your travels</Text>
          </View>
        </View>
        <EmptyState
          icon="alert-circle"
          title="Failed to load trips"
          description={error.message}
          actionLabel="Try Again"
          onAction={() => queryClient.invalidateQueries({ queryKey: ['trips'] })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>Find gyms during your travels</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSyncCalendar} disabled={isSyncing}>
            {isSyncing ? <ActivityIndicator color={colors.primary} size="small" /> : <Calendar size={iconSizes.md} color={colors.gray700} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleCreateTrip}>
            <Plus size={iconSizes.md} color={colors.gray700} />
          </TouchableOpacity>
        </View>
      </View>

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderTripCard}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmpty()
      )}
    </SafeAreaView>
  );
}

interface EnhancedTripCardProps {
  trip: TravelPeriod;
  onDelete: () => void;
}

function EnhancedTripCard({ trip, onDelete }: EnhancedTripCardProps) {
  const router = useRouter();

  const handleViewGyms = useCallback(() => {
    haptics.light();
    // TODO: Pre-fill search with trip location
    router.push('/(tabs)');
  }, [router]);

  const getDurationDays = (): number => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get city image or default
  const cityImage = CITY_IMAGES[trip.destinationCity] || CITY_IMAGES['default'];
  const durationDays = getDurationDays();

  // Mock data - would come from API
  const gymCount = Math.floor(Math.random() * 30) + 10;
  const weatherTemp = Math.floor(Math.random() * 30) + 50;

  return (
    <TouchableOpacity style={styles.card} onPress={handleViewGyms} activeOpacity={0.7}>
      {/* Destination Image */}
      <Image source={{ uri: cityImage }} style={styles.cardImage} />
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{durationDays} days</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{trip.destinationCity}</Text>
        <Text style={styles.cardSubtitle}>{trip.destinationState}, {trip.destinationCountry}</Text>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Calendar size={iconSizes.xs} color={colors.gray500} />
            <Text style={styles.metaText}>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Dumbbell size={iconSizes.xs} color={colors.primary} />
            <Text style={styles.metaTextHighlight}>{gymCount} gyms available</Text>
          </View>
          <View style={styles.metaItem}>
            <Cloud size={iconSizes.xs} color={colors.gray500} />
            <Text style={styles.metaText}>{weatherTemp}°F expected</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.viewGymsButton} onPress={handleViewGyms}>
          <Text style={styles.viewGymsButtonText}>Find Gyms</Text>
          <ChevronRight size={iconSizes.sm} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={iconSizes.sm} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  headerContent: { flex: 1 },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  headerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h2, color: colors.black },
  subtitle: { ...typography.small, color: colors.gray500, marginTop: spacing.xxs },
  listContent: { paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg },
  sectionHeader: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, marginBottom: spacing.md, overflow: 'hidden', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardImage: { width: '100%', height: 120, backgroundColor: colors.gray200 },
  durationBadge: { position: 'absolute', top: spacing.md, right: spacing.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, backgroundColor: colors.primary, borderRadius: radius.full },
  durationText: { ...typography.tinyBold, color: colors.white },
  cardContent: { padding: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.black, marginBottom: spacing.xxs },
  cardSubtitle: { ...typography.small, color: colors.gray500, marginBottom: spacing.md },
  cardMeta: { gap: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { ...typography.small, color: colors.gray600 },
  metaTextHighlight: { ...typography.smallBold, color: colors.primary },
  cardActions: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray100, gap: spacing.sm },
  viewGymsButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.md },
  viewGymsButtonText: { ...typography.smallBold, color: colors.white },
  deleteButton: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: padding.screenHorizontal },
  emptyActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  syncButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md },
  syncButtonText: { ...typography.bodyBold, color: colors.white },
  addTripButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.gray100, borderRadius: radius.md },
  addTripButtonText: { ...typography.bodyBold, color: colors.primary },
});
