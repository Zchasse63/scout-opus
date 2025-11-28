import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  style,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 40;
      case 'large':
        return 56;
      case 'xlarge':
        return 80;
      default:
        return 40;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return typography.sizes.xs;
      case 'medium':
        return typography.sizes.sm;
      case 'large':
        return typography.sizes.base;
      case 'xlarge':
        return typography.sizes.xl;
      default:
        return typography.sizes.sm;
    }
  };

  const getInitials = (): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarSize = getSize();
  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[styles.image, containerStyle, style as any]}
      />
    );
  }

  return (
    <View style={[styles.fallback, containerStyle, style]}>
      <Text style={[styles.initials, { fontSize: getFontSize() }]}>
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.gray100,
  },
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
});
