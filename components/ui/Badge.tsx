import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'verified'
  | 'open';

export type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  icon,
  style,
}) => {
  const getVariantStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'success':
        return {
          container: { backgroundColor: `${colors.success}15` },
          text: { color: colors.success },
        };
      case 'warning':
        return {
          container: { backgroundColor: `${colors.warning}15` },
          text: { color: colors.warning },
        };
      case 'error':
        return {
          container: { backgroundColor: `${colors.error}15` },
          text: { color: colors.error },
        };
      case 'info':
        return {
          container: { backgroundColor: `${colors.secondary}15` },
          text: { color: colors.secondary },
        };
      case 'verified':
        return {
          container: { backgroundColor: `${colors.primary}15` },
          text: { color: colors.primary },
        };
      case 'open':
        return {
          container: { backgroundColor: `${colors.success}15` },
          text: { color: colors.success },
        };
      case 'neutral':
      default:
        return {
          container: { backgroundColor: colors.gray100 },
          text: { color: colors.gray700 },
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xxs,
          borderRadius: 6,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: 8,
        };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return typography.sizes.xs;
      case 'medium':
      default:
        return typography.sizes.sm;
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View
      style={[
        styles.container,
        getSizeStyle(),
        variantStyle.container,
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          { fontSize: getFontSize() },
          variantStyle.text,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xxs,
  },
  label: {
    fontWeight: '600',
    lineHeight: typography.lineHeights.sm,
  },
});
