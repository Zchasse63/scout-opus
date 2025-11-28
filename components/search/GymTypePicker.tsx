/**
 * GymTypePicker - What type of gym section of structured search
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dumbbell, Waves, PersonStanding, Bike, Heart, Timer, Zap, Users } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import type { LucideIcon } from 'lucide-react-native';

interface GymType {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface GymTypePickerProps {
  value: string[];
  onChange: (types: string[]) => void;
}

const GYM_TYPES: GymType[] = [
  { id: 'traditional', name: 'Traditional Gym', icon: Dumbbell, description: 'Full gym floor' },
  { id: 'crossfit', name: 'CrossFit', icon: Zap, description: 'High intensity' },
  { id: 'yoga', name: 'Yoga Studio', icon: PersonStanding, description: 'Mind & body' },
  { id: 'pool', name: 'Pool & Spa', icon: Waves, description: 'Swimming & recovery' },
  { id: 'cycling', name: 'Cycling', icon: Bike, description: 'Spin classes' },
  { id: 'hiit', name: 'HIIT', icon: Timer, description: 'Circuit training' },
  { id: 'pilates', name: 'Pilates', icon: Heart, description: 'Core focused' },
  { id: 'climbing', name: 'Climbing', icon: Users, description: 'Boulder & wall' },
];

export function GymTypePicker({ value, onChange }: GymTypePickerProps) {
  const toggleType = (typeId: string) => {
    haptics.selection();
    if (value.includes(typeId)) {
      onChange(value.filter((id) => id !== typeId));
    } else {
      onChange([...value, typeId]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What</Text>
      <Text style={styles.sectionSubtitle}>Type of workout</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {GYM_TYPES.map((type) => {
            const isSelected = value.includes(type.id);
            const Icon = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => toggleType(type.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Icon
                    size={iconSizes.lg}
                    color={isSelected ? colors.white : colors.gray600}
                  />
                </View>
                <Text style={[styles.typeName, isSelected && styles.typeNameSelected]}>
                  {type.name}
                </Text>
                <Text style={[styles.typeDesc, isSelected && styles.typeDescSelected]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => onChange([])}>
          <Text style={styles.clearButtonText}>Clear selection ({value.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { ...typography.h2, color: colors.black, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.body, color: colors.gray600, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  typeCard: {
    width: '47%',
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  typeName: { ...typography.bodyBold, color: colors.black, marginBottom: spacing.xxs },
  typeNameSelected: { color: colors.primary },
  typeDesc: { ...typography.small, color: colors.gray600 },
  typeDescSelected: { color: colors.gray700 },
  clearButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  clearButtonText: { ...typography.body, color: colors.primary },
});

export default GymTypePicker;

