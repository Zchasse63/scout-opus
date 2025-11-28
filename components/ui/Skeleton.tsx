import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height={16}
        width={index === lines - 1 ? '60%' : '100%'}
        style={{ marginBottom: 8 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <Skeleton width="100%" height={200} borderRadius={16} style={{ marginBottom: 12 }} />
    <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
    <Skeleton width="60%" height={16} />
  </View>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} borderRadius={size / 2} />
);

export const SkeletonGymCard: React.FC = () => (
  <View style={styles.gymCard}>
    <Skeleton width="100%" height={180} borderRadius={16} />
    <View style={styles.gymCardContent}>
      <View style={styles.row}>
        <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width={60} height={20} />
      </View>
      <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />
      <View style={styles.row}>
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginRight: 8 }} />
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginRight: 8 }} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  </View>
);

// Skeleton list for explore/passes/trips screens
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <View style={styles.list}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGymCard key={index} />
    ))}
  </View>
);

// Skeleton for gym detail page
export const SkeletonDetail: React.FC = () => (
  <View style={styles.detail}>
    {/* Hero image */}
    <Skeleton width="100%" height={300} borderRadius={0} />

    {/* Content */}
    <View style={styles.detailContent}>
      {/* Title */}
      <Skeleton width="70%" height={28} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={18} style={{ marginBottom: 16 }} />

      {/* Rating and distance */}
      <View style={styles.row}>
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={100} height={24} borderRadius={12} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={16} style={{ marginBottom: 24 }} />

      {/* Amenities section */}
      <Skeleton width={120} height={20} style={{ marginBottom: 12 }} />
      <View style={styles.amenitiesGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width="45%" height={40} borderRadius={8} style={{ marginBottom: 8 }} />
        ))}
      </View>
    </View>
  </View>
);

// Skeleton for pass card
export const SkeletonPassCard: React.FC = () => (
  <View style={styles.passCard}>
    <View style={styles.row}>
      <Skeleton width={60} height={60} borderRadius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Skeleton width="70%" height={18} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={14} />
      </View>
      <Skeleton width={60} height={24} borderRadius={8} />
    </View>
  </View>
);

// Skeleton for trip card
export const SkeletonTripCard: React.FC = () => (
  <View style={styles.tripCard}>
    <Skeleton width="100%" height={120} borderRadius={12} style={{ marginBottom: 12 }} />
    <Skeleton width="60%" height={18} style={{ marginBottom: 6 }} />
    <Skeleton width="40%" height={14} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.gray200,
  },
  card: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  gymCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gymCardContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    padding: 16,
  },
  detail: {
    flex: 1,
    backgroundColor: colors.white,
  },
  detailContent: {
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  passCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
});
