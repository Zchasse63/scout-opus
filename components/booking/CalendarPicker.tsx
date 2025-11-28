/**
 * CalendarPicker - Date selection with availability indicators
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  availableDates,
  minDate = new Date(),
  maxDate,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const isDateAvailable = useCallback((date: Date) => {
    if (!availableDates) return true;
    return availableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  }, [availableDates]);

  const isDateDisabled = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  const isDateSelected = useCallback((date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  }, [selectedDate]);

  const handlePrevMonth = () => {
    haptics.light();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    haptics.light();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDatePress = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(date)) {
      haptics.selection();
      onDateSelect(date);
    }
  };

  const renderDays = () => {
    const days = [];
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const available = isDateAvailable(date);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            selected && styles.dayCellSelected,
            disabled && styles.dayCellDisabled,
          ]}
          onPress={() => handleDatePress(day)}
          disabled={disabled}
        >
          <Text style={[
            styles.dayText,
            selected && styles.dayTextSelected,
            disabled && styles.dayTextDisabled,
          ]}>
            {day}
          </Text>
          {available && !disabled && <View style={styles.availableDot} />}
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRight size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.daysHeader}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.daysGrid}>{renderDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  navButton: { padding: spacing.sm },
  monthYear: { ...typography.h4, color: colors.black },
  daysHeader: { flexDirection: 'row', marginBottom: spacing.sm },
  dayLabel: { flex: 1, textAlign: 'center', ...typography.small, color: colors.gray500 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dayCellSelected: { backgroundColor: colors.primary, borderRadius: 20 },
  dayCellDisabled: { opacity: 0.3 },
  dayText: { ...typography.body, color: colors.black },
  dayTextSelected: { color: colors.white, fontWeight: '600' },
  dayTextDisabled: { color: colors.gray400 },
  availableDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.success },
});

export default CalendarPicker;

