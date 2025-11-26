import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Calendar,
  ChevronRight,
  Plane,
} from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Badge } from '../ui/Badge';

interface TripCardProps {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  gymCount: number;
  coverImage?: string;
  status: 'upcoming' | 'active' | 'past';
  isAutoDetected?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  tripId,
  destination,
  startDate,
  endDate,
  gymCount,
  coverImage,
  status,
  isAutoDetected = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/trips/${tripId}`);
  };

  const formatDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  const getDaysUntil = () => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    return null;
  };

  const getStatusBadge = () => {
    if (status === 'active') {
      return <Badge label="In Progress" variant="success" size="small" />;
    }
    if (status === 'upcoming') {
      const daysUntil = getDaysUntil();
      if (daysUntil) {
        return <Badge label={daysUntil} variant="info" size="small" />;
      }
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* Cover Image */}
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      ) : (
        <View style={[styles.coverImage, styles.placeholderCover]}>
          <Plane color={colors.gray400} size={40} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.destination}>{destination}</Text>
            {isAutoDetected && (
              <Badge label="Auto-detected" variant="info" size="small" />
            )}
          </View>
          {getStatusBadge()}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar color={colors.gray500} size={16} />
            <Text style={styles.detailText}>{formatDateRange()}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin color={colors.gray500} size={16} />
            <Text style={styles.detailText}>
              {gymCount} {gymCount === 1 ? 'gym' : 'gyms'} saved
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.viewTrip}>View Trip</Text>
          <ChevronRight color={colors.primary} size={20} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray100,
  },
  placeholderCover: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  destination: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  details: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginLeft: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  viewTrip: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primary,
  },
});
