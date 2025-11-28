import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface AudioWaveformProps {
  isActive: boolean;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  barCount = 40,
}) => {
  const bars = Array.from({ length: barCount });

  return (
    <View style={styles.container}>
      {bars.map((_, index) => (
        <WaveformBar
          key={index}
          index={index}
          isActive={isActive}
          totalBars={barCount}
        />
      ))}
    </View>
  );
};

interface WaveformBarProps {
  index: number;
  isActive: boolean;
  totalBars: number;
}

const WaveformBar: React.FC<WaveformBarProps> = ({
  index,
  isActive,
  totalBars,
}) => {
  const height = useSharedValue(4);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      // Create wave effect with staggered delays
      const delay = (index / totalBars) * 500;
      const duration = 400 + Math.random() * 200;

      height.value = withDelay(
        delay,
        withRepeat(
          withTiming(30 + Math.random() * 50, {
            duration,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );

      opacity.value = withRepeat(
        withTiming(1, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      height.value = withTiming(4, { duration: 300 });
      opacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isActive, index, totalBars]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
};

// Pulsing circle for mic button
interface PulsingMicCircleProps {
  isActive: boolean;
  size?: number;
}

export const PulsingMicCircle: React.FC<PulsingMicCircleProps> = ({
  isActive,
  size = 100,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.2, { duration: 800 }),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [isActive, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulseCircle,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    minHeight: 4,
  },
  pulseCircle: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
});
