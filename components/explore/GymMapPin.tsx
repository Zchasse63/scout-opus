import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

interface GymMapPinProps {
  id: string;
  latitude: number;
  longitude: number;
  price: number;
  isSelected: boolean;
  onPress: (id: string) => void;
}

export const GymMapPin: React.FC<GymMapPinProps> = ({
  id,
  latitude,
  longitude,
  price,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(isSelected ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1.2 : 1, {
      damping: 15,
      stiffness: 300,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(id)}
      tracksViewChanges={false}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.container,
            isSelected && styles.containerSelected,
          ]}
          activeOpacity={0.8}
        >
          {/* Price label */}
          <View
            style={[
              styles.priceContainer,
              isSelected && styles.priceContainerSelected,
            ]}
          >
            <Text
              style={[
                styles.priceText,
                isSelected && styles.priceTextSelected,
              ]}
            >
              ${price}
            </Text>
          </View>

          {/* Arrow/pointer */}
          <View
            style={[
              styles.arrow,
              isSelected && styles.arrowSelected,
            ]}
          />
        </TouchableOpacity>
      </Animated.View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerSelected: {
    zIndex: 1000,
  },
  priceContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  priceContainerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  priceText: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  priceTextSelected: {
    color: colors.white,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -1,
  },
  arrowSelected: {
    borderTopColor: colors.primaryDark,
  },
});
