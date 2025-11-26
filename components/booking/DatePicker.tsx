import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PassType } from './CheckoutForm';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  passType: PassType;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  passType,
}) => {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <View style={styles.container}>
      {dates.map((date, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dateOption,
            isSelected(date) && styles.dateOptionSelected,
          ]}
          onPress={() => onDateChange(date)}
        >
          <Text style={[
            styles.dayLabel,
            isSelected(date) && styles.dayLabelSelected,
          ]}>
            {isToday(date) ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
          </Text>
          <Text style={[
            styles.dateLabel,
            isSelected(date) && styles.dateLabelSelected,
          ]}>
            {date.getDate()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray100,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  dateOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dayLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    marginBottom: spacing.xxs,
  },
  dayLabelSelected: {
    color: colors.white,
  },
  dateLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.black,
  },
  dateLabelSelected: {
    color: colors.white,
  },
});
