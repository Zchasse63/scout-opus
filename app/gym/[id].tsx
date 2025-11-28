import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Share,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Share2, Heart, Star, MapPin, Clock, BadgeCheck, Users, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useSavedGyms } from '../../hooks/useSavedGyms';
import { useGym } from '../../hooks/useGym';
import { FullScreenGallery } from '../../components/gym/FullScreenGallery';
import { SkeletonDetail } from '../../components/ui/Skeleton';
import { VerifiedBadge } from '../../components/ui/TrustBadges';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 300;

export default function GymDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedGyms();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const scrollY = useSharedValue(0);

  // Fetch gym data from Supabase
  const { data: gym, isLoading, error } = useGym(id);
  const saved = gym ? isSaved(gym.id) : false;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HERO_HEIGHT - 100], [0, 1]),
    backgroundColor: scrollY.value > HERO_HEIGHT - 100 ? colors.white : 'transparent',
  }));

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <SkeletonDetail />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !gym) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load gym</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Gym not found'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = useCallback(async () => {
    haptics.light();
    try {
      await Share.share({
        message: `Check out ${gym.name} on Scout! 💪`,
        url: `https://scout.app/gym/${gym.id}`,
        title: gym.name,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [gym.id, gym.name]);

  const handleBooking = useCallback(() => {
    haptics.medium();
    router.push(`/booking/${gym.id}`);
  }, [router, gym.id]);

  const handleSaveToggle = useCallback(() => {
    haptics.heart();
    toggleSave(gym.id);
  }, [toggleSave, gym.id]);

  const handlePhotoPress = (index: number) => {
    setActivePhotoIndex(index);
    setShowGallery(true);
  };

  const distance = '2.3 km away';
  const bookedToday = Math.floor(Math.random() * 20) + 5; // Simulated

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={iconSizes.lg} color={colors.gray800} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Share2 size={iconSizes.md} color={colors.gray800} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Photo Gallery */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: gym.photos[activePhotoIndex] }}
            style={styles.mainPhoto}
          />
          <View style={styles.photoIndicator}>
            <Text style={styles.photoIndicatorText}>
              {activePhotoIndex + 1} / {gym.photos.length}
            </Text>
          </View>

          {/* Thumbnail Gallery */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailScroll}
          >
            {gym.photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePhotoPress(index)}
                style={[
                  styles.thumbnail,
                  activePhotoIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image
                  source={{ uri: photo }}
                  style={styles.thumbnailImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Gym Info */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{gym.name}</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveToggle}
              >
                <Heart
                  size={iconSizes.xl}
                  color={saved ? colors.error : colors.gray400}
                  fill={saved ? colors.error : 'transparent'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.distance}>{distance}</Text>
          </View>

          {/* Rating and Reviews */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingRow}>
              <Star size={iconSizes.md} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>
                {gym.rating.toFixed(1)} ({gym.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressSection}>
            <Text style={styles.sectionLabel}>Location</Text>
            <Text style={styles.address}>{gym.address}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.description}>{gym.description}</Text>
          </View>

          {/* Hours */}
          {gym.hours && (
            <View style={styles.hoursSection}>
              <Text style={styles.sectionLabel}>Hours</Text>
              <View style={styles.hoursGrid}>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <View key={day} style={styles.hoursRow}>
                    <Text style={styles.dayLabel}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Text style={styles.hourText}>
                      {gym.hours?.[day as keyof typeof gym.hours] || 'Closed'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Amenities */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionLabel}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {gym.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <Text style={styles.sectionLabel}>Pass Pricing</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Day Pass</Text>
                <Text style={styles.priceAmount}>${gym.dayPassPrice}</Text>
              </View>
              {gym.weekPassPrice && (
                <View style={styles.priceCard}>
                  <Text style={styles.priceLabel}>Week Pass</Text>
                  <Text style={styles.priceAmount}>${gym.weekPassPrice}</Text>
                </View>
              )}
              {gym.monthPassPrice && (
                <View style={styles.priceCard}>
                  <Text style={styles.priceLabel}>Month Pass</Text>
                  <Text style={styles.priceAmount}>${gym.monthPassPrice}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Spacer for sticky button */}
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Sticky Booking Button */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookingButtonText}>Book Pass</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
    height: 300,
    marginBottom: padding.md,
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoIndicator: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
    borderRadius: radius.md,
  },
  photoIndicatorText: {
    ...typography.caption,
    color: colors.white,
  },
  thumbnailScroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
    overflow: 'hidden',
    opacity: 0.7,
  },
  thumbnailActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: padding.md,
    paddingBottom: 120,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    flex: 1,
    paddingRight: spacing.md,
  },
  saveButton: {
    padding: spacing.sm,
  },
  saveButtonText: {
    fontSize: 28,
  },
  distance: {
    ...typography.body,
    color: colors.gray600,
  },
  ratingSection: {
    marginBottom: spacing.lg,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.body,
    color: colors.black,
    marginLeft: spacing.xs,
  },
  addressSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.subtitle,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  address: {
    ...typography.body,
    color: colors.gray700,
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.gray700,
    lineHeight: 22,
  },
  hoursSection: {
    marginBottom: spacing.lg,
  },
  hoursGrid: {
    gap: spacing.sm,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  dayLabel: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
  },
  hourText: {
    ...typography.body,
    color: colors.gray600,
  },
  amenitiesSection: {
    marginBottom: spacing.lg,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  amenityText: {
    ...typography.caption,
    color: colors.gray800,
  },
  pricingSection: {
    marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceCard: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  priceAmount: {
    ...typography.h3,
    color: colors.primary,
  },
  spacer: {
    height: spacing.lg,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bookingButton: {
    backgroundColor: colors.primary,
    paddingVertical: padding.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButtonText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.lg,
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
    padding: padding.lg,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.md,
  },
  errorMessage: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
