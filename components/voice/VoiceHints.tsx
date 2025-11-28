/**
 * VoiceHints - Shows voice command suggestions while recording
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Mic, MapPin, DollarSign, Dumbbell, Clock } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import type { LucideIcon } from 'lucide-react-native';

interface VoiceHint {
  id: string;
  command: string;
  description: string;
  icon: LucideIcon;
  example: string;
}

interface VoiceHintsProps {
  onHintPress?: (command: string) => void;
  compact?: boolean;
}

export const VOICE_COMMANDS: VoiceHint[] = [
  {
    id: 'location',
    command: 'Near [location]',
    description: 'Find gyms by location',
    icon: MapPin,
    example: '"Gyms near downtown"',
  },
  {
    id: 'price',
    command: 'Under $[amount]',
    description: 'Filter by price',
    icon: DollarSign,
    example: '"Under $20"',
  },
  {
    id: 'type',
    command: '[Gym type]',
    description: 'Search gym types',
    icon: Dumbbell,
    example: '"CrossFit gyms"',
  },
  {
    id: 'hours',
    command: 'Open [time]',
    description: 'Filter by hours',
    icon: Clock,
    example: '"Open 24 hours"',
  },
];

export function VoiceHints({ onHintPress, compact = false }: VoiceHintsProps) {
  if (compact) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.compactContainer}
      >
        {VOICE_COMMANDS.map((hint) => {
          const Icon = hint.icon;
          return (
            <TouchableOpacity
              key={hint.id}
              style={styles.compactHint}
              onPress={() => onHintPress?.(hint.example.replace(/"/g, ''))}
            >
              <Icon size={iconSizes.xs} color={colors.primary} />
              <Text style={styles.compactText}>{hint.command}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Try saying</Text>
      <View style={styles.hints}>
        {VOICE_COMMANDS.map((hint) => {
          const Icon = hint.icon;
          return (
            <TouchableOpacity
              key={hint.id}
              style={styles.hint}
              onPress={() => onHintPress?.(hint.example.replace(/"/g, ''))}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon size={iconSizes.sm} color={colors.primary} />
              </View>
              <View style={styles.hintContent}>
                <Text style={styles.command}>{hint.command}</Text>
                <Text style={styles.example}>{hint.example}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  title: { ...typography.smallBold, color: colors.gray600, textAlign: 'center' },
  hints: { gap: spacing.sm },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.gray50,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContent: { flex: 1 },
  command: { ...typography.bodyBold, color: colors.black },
  example: { ...typography.small, color: colors.gray600 },
  compactContainer: { paddingVertical: spacing.sm, gap: spacing.sm },
  compactHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  compactText: { ...typography.small, color: colors.gray700 },
});

export default VoiceHints;

