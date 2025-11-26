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
          width,
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
    {/* Image */}
    <Skeleton width="100%" height={180} borderRadius={16} />

    {/* Content */}
    <View style={styles.gymCardContent}>
      {/* Title and rating */}
      <View style={styles.row}>
        <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width={60} height={20} />
      </View>

      {/* Address */}
      <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />

      {/* Amenities */}
      <View style={styles.row}>
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginRight: 8 }} />
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginRight: 8 }} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
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
});
