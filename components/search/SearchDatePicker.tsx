/**
 * SearchDatePicker - When section of structured search
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Clock, Sun, Moon } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface DateOption {
  id: string;
  label: string;
  sublabel: string;
  date: Date | null;
}

interface SearchDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function SearchDatePicker({ value, onChange }: SearchDatePickerProps) {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string | null>(null);

  const getDateOptions = (): DateOption[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thisWeekend = new Date(today);
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
    thisWeekend.setDate(today.getDate() + daysUntilSaturday);

    return [
      { id: 'flexible', label: "I'm flexible", sublabel: 'Any time', date: null },
      { id: 'today', label: 'Today', sublabel: formatDate(today), date: today },
      { id: 'tomorrow', label: 'Tomorrow', sublabel: formatDate(tomorrow), date: tomorrow },
      { id: 'weekend', label: 'This weekend', sublabel: formatDate(thisWeekend), date: thisWeekend },
    ];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateSelect = (option: DateOption) => {
    haptics.selection();
    onChange(option.date);
  };

  const handleTimeSelect = (time: string) => {
    haptics.light();
    setSelectedTimeOfDay(time === selectedTimeOfDay ? null : time);
  };

  const isSelected = (option: DateOption): boolean => {
    if (option.date === null && value === null) return true;
    if (option.date === null || value === null) return false;
    return option.date.toDateString() === value.toDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>When</Text>
      <Text style={styles.sectionSubtitle}>Add dates for availability</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {getDateOptions().map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.dateCard, isSelected(option) && styles.dateCardSelected]}
            onPress={() => handleDateSelect(option)}
          >
            <Calendar
              size={iconSizes.md}
              color={isSelected(option) ? colors.primary : colors.gray600}
            />
            <Text style={[styles.dateLabel, isSelected(option) && styles.dateLabelSelected]}>
              {option.label}
            </Text>
            <Text style={[styles.dateSublabel, isSelected(option) && styles.dateSublabelSelected]}>
              {option.sublabel}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.timeTitle}>Time of day (optional)</Text>
      <View style={styles.timeOptions}>
        <TouchableOpacity
          style={[styles.timeChip, selectedTimeOfDay === 'morning' && styles.timeChipSelected]}
          onPress={() => handleTimeSelect('morning')}
        >
          <Sun size={iconSizes.sm} color={selectedTimeOfDay === 'morning' ? colors.white : colors.gray600} />
          <Text style={[styles.timeText, selectedTimeOfDay === 'morning' && styles.timeTextSelected]}>
            Morning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeChip, selectedTimeOfDay === 'afternoon' && styles.timeChipSelected]}
          onPress={() => handleTimeSelect('afternoon')}
        >
          <Clock size={iconSizes.sm} color={selectedTimeOfDay === 'afternoon' ? colors.white : colors.gray600} />
          <Text style={[styles.timeText, selectedTimeOfDay === 'afternoon' && styles.timeTextSelected]}>
            Afternoon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeChip, selectedTimeOfDay === 'evening' && styles.timeChipSelected]}
          onPress={() => handleTimeSelect('evening')}
        >
          <Moon size={iconSizes.sm} color={selectedTimeOfDay === 'evening' ? colors.white : colors.gray600} />
          <Text style={[styles.timeText, selectedTimeOfDay === 'evening' && styles.timeTextSelected]}>
            Evening
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { ...typography.h2, color: colors.black, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.body, color: colors.gray600, marginBottom: spacing.lg },
  dateScroll: { marginBottom: spacing.xl },
  dateCard: {
    width: 120, padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.gray50, marginRight: spacing.md, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  dateCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  dateLabel: { ...typography.bodyBold, color: colors.black, marginTop: spacing.sm },
  dateLabelSelected: { color: colors.primary },
  dateSublabel: { ...typography.small, color: colors.gray600, marginTop: spacing.xxs },
  dateSublabelSelected: { color: colors.gray700 },
  timeTitle: { ...typography.smallBold, color: colors.gray700, marginBottom: spacing.md },
  timeOptions: { flexDirection: 'row', gap: spacing.sm },
  timeChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.full, backgroundColor: colors.gray100,
  },
  timeChipSelected: { backgroundColor: colors.primary },
  timeText: { ...typography.small, color: colors.gray700 },
  timeTextSelected: { color: colors.white },
});

export default SearchDatePicker;

