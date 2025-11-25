import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Booking } from '../../types';
import { useBookings } from '../../hooks/useBookings';

interface BookingSection {
  title: string;
  data: Booking[];
}

export default function PassesTab() {
  const { data: bookings, isLoading, error } = useBookings();
  const today = new Date().toISOString().split('T')[0];

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Passes</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your passes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Passes</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load passes</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Categorize bookings
  const activeBookings = bookings?.filter(
    (b) => b.bookingDate === today && b.status !== 'cancelled'
  ) || [];

  const upcomingBookings = bookings?.filter(
    (b) => b.bookingDate > today && b.status !== 'cancelled'
  ) || [];

  const pastBookings = bookings?.filter((b) => b.bookingDate < today) || [];

  const sections: BookingSection[] = [
    { title: 'Active Today', data: activeBookings },
    { title: 'Upcoming', data: upcomingBookings },
    { title: 'Past', data: pastBookings },
  ].filter((s) => s.data.length > 0);

  const handleShowQR = useCallback((booking: Booking) => {
    // TODO: Show QR code modal
    console.log('Show QR code for:', booking.id);
  }, []);

  const handleAddToWallet = useCallback((booking: Booking) => {
    // TODO: Add to Apple Wallet
    console.log('Add to wallet:', booking.id);
  }, []);

  const renderBookingCard = ({ item: booking }: { item: Booking }) => (
    <BookingCard
      booking={booking}
      onShowQR={() => handleShowQR(booking)}
      onAddToWallet={() => handleAddToWallet(booking)}
    />
  );

  const renderSectionHeader = ({ section }: { section: BookingSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🎟️</Text>
      <Text style={styles.emptyTitle}>No Passes Yet</Text>
      <Text style={styles.emptyText}>Book a gym pass to get started</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Passes</Text>
      </View>

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingCard}
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

interface BookingCardProps {
  booking: Booking;
  onShowQR: () => void;
  onAddToWallet: () => void;
}

function BookingCard({ booking, onShowQR, onAddToWallet }: BookingCardProps) {
  const getPassTypeLabel = (type: string) => {
    switch (type) {
      case 'day':
        return 'Day Pass';
      case 'week':
        return 'Week Pass';
      case 'month':
        return 'Month Pass';
      default:
        return 'Pass';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.green600;
      case 'used':
        return colors.gray600;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray700;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'used':
        return '✓✓';
      case 'cancelled':
        return '✕';
      default:
        return '•';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{getPassTypeLabel(booking.passType)}</Text>
          <Text style={styles.cardDate}>{booking.bookingDate}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardFooter}>
        <Text style={styles.bookingId}>{booking.id}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onShowQR}>
            <Text style={styles.actionButtonText}>📱 QR Code</Text>
          </TouchableOpacity>
          {booking.status === 'confirmed' && (
            <TouchableOpacity style={styles.actionButton} onPress={onAddToWallet}>
              <Text style={styles.actionButtonText}>💾 Wallet</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  title: {
    ...typography.h2,
    color: colors.black,
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
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  cardDate: {
    ...typography.caption,
    color: colors.gray600,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.gray100,
  },
  cardFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bookingId: {
    ...typography.caption,
    color: colors.gray500,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
