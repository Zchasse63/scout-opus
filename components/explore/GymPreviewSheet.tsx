import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Star,
  DollarSign,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';
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
  distance: number;
  amenities: string[];
  isVerified: boolean;
  isSaved: boolean;
}

interface GymPreviewSheetProps {
  gym: Gym | null;
  onClose: () => void;
  onSaveToggle?: (gymId: string) => void;
}

export const GymPreviewSheet: React.FC<GymPreviewSheetProps> = ({
  gym,
  onClose,
  onSaveToggle,
}) => {
  const router = useRouter();

  if (!gym) return null;

  const handleViewDetails = () => {
    router.push(`/gym/${gym.id}`);
    onClose();
  };

  const handleSaveToggle = () => {
    onSaveToggle?.(gym.id);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutDown.duration(200)}
      style={styles.container}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: gym.primaryPhoto }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveToggle}
        >
          <Heart
            color={gym.isSaved ? colors.error : colors.white}
            size={20}
            fill={gym.isSaved ? colors.error : 'none'}
          />
        </TouchableOpacity>

        {/* Verified badge */}
        {gym.isVerified && (
          <View style={styles.verifiedBadge}>
            <Badge label="Verified" variant="verified" size="small" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name} numberOfLines={1}>
              {gym.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Star
                color={colors.warning}
                size={16}
                fill={colors.warning}
              />
              <Text style={styles.rating}>
                {gym.rating.toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>
                ({gym.reviewCount})
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <DollarSign color={colors.primary} size={16} />
            <Text style={styles.price}>${gym.dayPassPrice}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MapPin color={colors.gray500} size={14} />
          <Text style={styles.address} numberOfLines={1}>
            {gym.address}
          </Text>
          <Text style={styles.distance}>
            {gym.distance.toFixed(1)} mi
          </Text>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          {gym.amenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={index}
              label={amenity}
              variant="neutral"
              size="small"
            />
          ))}
          {gym.amenities.length > 3 && (
            <Badge
              label={`+${gym.amenities.length - 3}`}
              variant="neutral"
              size="small"
            />
          )}
        </View>

        {/* View Details button */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={handleViewDetails}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <ChevronRight color={colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
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
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.black,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
    marginLeft: spacing.xxs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  price: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  address: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  distance: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.gray700,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  detailsButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.white,
    marginRight: spacing.xs,
  },
});
