import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      ...getSizeStyle(),
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray300 : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray300 : colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? colors.gray300 : colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          minHeight: 44,
        };
      case 'large':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          minHeight: 52,
        };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...getFontStyle(),
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseStyle,
          color: colors.white,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: disabled ? colors.gray300 : colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: disabled ? colors.gray300 : colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getFontStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.sizes.sm,
          lineHeight: typography.lineHeights.sm,
        };
      case 'medium':
        return {
          fontSize: typography.sizes.base,
          lineHeight: typography.lineHeights.base,
        };
      case 'large':
        return {
          fontSize: typography.sizes.lg,
          lineHeight: typography.lineHeights.lg,
        };
      default:
        return {
          fontSize: typography.sizes.base,
          lineHeight: typography.lineHeights.base,
        };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? colors.white : colors.primary}
          size="small"
        />
      );
    }

    const textElement = (
      <Text style={[getTextStyle(), textStyle]} numberOfLines={1}>
        {title}
      </Text>
    );

    if (!icon) {
      return textElement;
    }

    return (
      <>
        {iconPosition === 'left' && (
          <>{icon}</>
        )}
        {textElement}
        {iconPosition === 'right' && (
          <>{icon}</>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});
