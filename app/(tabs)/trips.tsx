import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTripsStore } from '../../stores/tripsStore';
import { useTrips } from '../../hooks/useTrips';
import { syncCalendarToTrips } from '../../services/calendar';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { TravelPeriod } from '../../types';

interface TripSection {
  title: string;
  data: TravelPeriod[];
}

export default function TripsTab() {
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
    setIsSyncing(true);
    try {
      // Sync calendar events to travel periods
      const count = await syncCalendarToTrips();

      // Refresh trips query
      queryClient.invalidateQueries({ queryKey: ['trips'] });

      if (count > 0) {
        Alert.alert(
          'Calendar Synced',
          `Found ${count} trip${count === 1 ? '' : 's'} from your calendar.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Trips Found',
          'No travel events were detected in your calendar.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Calendar sync error:', error);
      Alert.alert(
        'Sync Failed',
        error instanceof Error
          ? error.message
          : 'Failed to sync calendar. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient]);

  const renderTripCard = ({ item: trip }: { item: TravelPeriod }) => (
    <TripCard trip={trip} />
  );

  const renderSectionHeader = ({ section }: { section: TripSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>✈️</Text>
      <Text style={styles.emptyTitle}>No Trips Detected</Text>
      <Text style={styles.emptyText}>
        Sync your iOS Calendar to automatically detect travel plans
      </Text>
      <TouchableOpacity
        style={styles.syncButton}
        onPress={handleSyncCalendar}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.syncButtonText}>📅 Sync Calendar</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Show loading state
  if (isLoadingTrips) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Trips</Text>
            <Text style={styles.subtitle}>Find gyms during your travels</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Trips</Text>
            <Text style={styles.subtitle}>Find gyms during your travels</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load trips</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Your Trips</Text>
          <Text style={styles.subtitle}>Find gyms during your travels</Text>
        </View>
        <TouchableOpacity
          style={styles.syncButtonSmall}
          onPress={handleSyncCalendar}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={styles.syncButtonSmallText}>📅</Text>
          )}
        </TouchableOpacity>
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

interface TripCardProps {
  trip: TravelPeriod;
}

function TripCard({ trip }: TripCardProps) {
  const router = useRouter();

  const handleViewGyms = useCallback(() => {
    // Navigate to explore tab
    // TODO: In a future enhancement, pre-fill the search with trip location
    router.push('/(tabs)');
  }, [router]);

  const getDurationDays = (): number => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getConfidenceBadge = (): string => {
    if (trip.confidenceScore >= 0.9) return '🟢 High';
    if (trip.confidenceScore >= 0.7) return '🟡 Medium';
    return '🔴 Low';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const durationDays = getDurationDays();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{trip.destinationCity}</Text>
          <Text style={styles.cardSubtitle}>
            {trip.destinationState}, {trip.destinationCountry}
          </Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{durationDays} days</Text>
        </View>
      </View>

      <View style={styles.cardDates}>
        <Text style={styles.dateRange}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceText}>{getConfidenceBadge()}</Text>
          <Text style={styles.sourceText}>From {trip.source === 'ios_calendar' ? 'Calendar' : 'Manual'}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewGymsButton}
          onPress={handleViewGyms}
        >
          <Text style={styles.viewGymsButtonText}>View Gyms →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.black,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  syncButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButtonSmallText: {
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: padding.md,
    paddingVertical: spacing.lg,
  },
  sectionHeader: {
    ...typography.subtitle,
    color: colors.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.orange50,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.gray600,
  },
  durationBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  durationText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  cardDates: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  dateRange: {
    ...typography.body,
    color: colors.black,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  confidenceContainer: {
    flex: 1,
  },
  confidenceText: {
    ...typography.small,
    color: colors.gray700,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sourceText: {
    ...typography.caption,
    color: colors.gray600,
  },
  viewGymsButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
  viewGymsButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: padding.md,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  syncButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  syncButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray600,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: padding.lg,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
  },
});
