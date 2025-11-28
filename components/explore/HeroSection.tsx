/**
 * HeroSection - Lifestyle hero with tagline and quick-book
 */

import React from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Zap } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroSectionProps {
  onSearchPress?: () => void;
  onQuickBookPress?: () => void;
  lastGymName?: string;
  lastGymId?: string;
  userName?: string;
}

export function HeroSection({
  onSearchPress,
  onQuickBookPress,
  lastGymName,
  lastGymId,
  userName,
}: HeroSectionProps) {
  const greeting = userName ? `Welcome back, ${userName}` : 'Find your perfect workout';

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.tagline}>
            Access 10,000+ gyms worldwide{'\n'}with a single day pass
          </Text>

          {/* Search CTA */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              haptics.light();
              onSearchPress?.();
            }}
            activeOpacity={0.9}
          >
            <Search size={iconSizes.md} color={colors.gray600} />
            <Text style={styles.searchPlaceholder}>Where do you want to work out?</Text>
          </TouchableOpacity>

          {/* Quick Book for returning users */}
          {lastGymName && lastGymId && (
            <TouchableOpacity
              style={styles.quickBookButton}
              onPress={() => {
                haptics.medium();
                onQuickBookPress?.();
              }}
              activeOpacity={0.8}
            >
              <Zap size={iconSizes.sm} color={colors.white} fill={colors.white} />
              <Text style={styles.quickBookText}>Book again at {lastGymName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: padding.screenHorizontal,
    paddingBottom: spacing.xl,
  },
  content: {
    gap: spacing.md,
  },
  greeting: {
    ...typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagline: {
    ...typography.h2,
    color: colors.white,
    lineHeight: 36,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.gray600,
  },
  quickBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  quickBookText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});

export default HeroSection;

