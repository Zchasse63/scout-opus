import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MapPin, DollarSign, X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Badge } from '../ui/Badge';

interface Gym {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  dayPassPrice: number;
  primaryPhoto: string;
  isVerified: boolean;
  distance?: number;
}

interface TripGymListProps {
  tripId: string;
  gyms: Gym[];
  onRemoveGym?: (gymId: string) => void;
  emptyMessage?: string;
}

export const TripGymList: React.FC<TripGymListProps> = ({
  tripId,
  gyms,
  onRemoveGym,
  emptyMessage = 'No gyms added yet. Search and save gyms at your destination.',
}) => {
  const router = useRouter();

  const handleGymPress = (gymId: string) => {
    router.push(`/gym/${gymId}`);
  };

  const handleRemoveGym = (gymId: string, gymName: string) => {
    if (onRemoveGym) {
      // Could add confirmation alert here
      onRemoveGym(gymId);
    }
  };

  const renderGymItem = ({ item: gym }: { item: Gym }) => (
    <TouchableOpacity
      style={styles.gymCard}
      onPress={() => handleGymPress(gym.id)}
    >
      {/* Photo */}
      <Image source={{ uri: gym.primaryPhoto }} style={styles.gymPhoto} />

      {/* Remove Button */}
      {onRemoveGym && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveGym(gym.id, gym.name)}
        >
          <X color={colors.white} size={16} />
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.gymContent}>
        <View style={styles.gymHeader}>
          <Text style={styles.gymName} numberOfLines={1}>
            {gym.name}
          </Text>
          {gym.isVerified && <Badge label="Verified" variant="verified" size="small" />}
        </View>

        <View style={styles.gymDetails}>
          <View style={styles.detailRow}>
            <MapPin color={colors.gray500} size={14} />
            <Text style={styles.detailText} numberOfLines={1}>
              {gym.address}
            </Text>
          </View>

          <View style={styles.gymMeta}>
            <View style={styles.metaItem}>
              <Star color={colors.warning} size={14} fill={colors.warning} />
              <Text style={styles.metaText}>
                {gym.rating.toFixed(1)} ({gym.reviewCount})
              </Text>
            </View>

            <View style={styles.metaItem}>
              <DollarSign color={colors.success} size={14} />
              <Text style={styles.metaText}>${gym.dayPassPrice}</Text>
            </View>

            {gym.distance && (
              <View style={styles.metaItem}>
                <MapPin color={colors.gray500} size={14} />
                <Text style={styles.metaText}>{gym.distance.toFixed(1)} mi</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MapPin color={colors.gray400} size={48} />
      </View>
      <Text style={styles.emptyTitle}>No Gyms Added</Text>
      <Text style={styles.emptyMessage}>{emptyMessage}</Text>
    </View>
  );

  return (
    <FlatList
      data={gyms}
      renderItem={renderGymItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={gyms.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  gymCard: {
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
  gymPhoto: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray100,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  gymContent: {
    padding: spacing.md,
  },
  gymHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  gymName: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  gymDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.gray600,
  },
  gymMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: typography.sizes.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
  },
});
