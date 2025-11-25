import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useBookingStore } from '../../stores/bookingStore';
import { useGym } from '../../hooks/useGym';
import { usePayment } from '../../hooks/usePayment';

type PassType = 'day' | 'week' | 'month';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setSelectedGym, setPassType, setSelectedDate } = useBookingStore();
  const [selectedPass, setSelectedPass] = useState<PassType>('day');
  const [selectedDate, setSelectedDateState] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Fetch gym data from Supabase
  const { data: gym, isLoading, error } = useGym(id);

  // Payment hook
  const { processPayment, isProcessing } = usePayment();

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading gym details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !gym) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load gym</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Gym not found'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleContinue = useCallback(async () => {
    if (!gym || !id) return;

    const amount = getPrice(selectedPass);

    // Store booking details in store (for navigation/state)
    setSelectedGym(gym);
    setPassType(selectedPass);
    setSelectedDate(selectedDate);

    // Process payment with Stripe
    const result = await processPayment({
      gymId: id,
      passType: selectedPass,
      amount,
      bookingDate: selectedDate,
    });

    if (result.success) {
      // Payment successful - navigate to passes tab
      Alert.alert(
        'Booking Confirmed!',
        'Your gym pass has been booked successfully.',
        [
          {
            text: 'View Pass',
            onPress: () => router.push('/(tabs)/passes'),
          },
        ]
      );
    } else {
      // Payment failed or cancelled
      if (result.error?.includes('cancel')) {
        // User cancelled - don't show error
        return;
      }
      Alert.alert(
        'Payment Failed',
        result.error || 'Unable to process payment. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [gym, id, selectedPass, selectedDate, processPayment, setSelectedGym, setPassType, setSelectedDate, router]);

  const handleDateChange = useCallback((days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDateState(newDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  const allPassOptions: Array<{
    type: PassType;
    label: string;
    price: number | undefined;
    duration: string;
  }> = [
    { type: 'day' as const, label: 'Day Pass', price: gym.dayPassPrice, duration: '24 hours' },
    { type: 'week' as const, label: 'Week Pass', price: gym.weekPassPrice, duration: '7 days' },
    { type: 'month' as const, label: 'Month Pass', price: gym.monthPassPrice, duration: '30 days' },
  ];

  const passOptions = allPassOptions.filter((option) => option.price !== undefined);

  const getPrice = (type: PassType): number => {
    switch (type) {
      case 'day':
        return gym.dayPassPrice;
      case 'week':
        return gym.weekPassPrice || 0;
      case 'month':
        return gym.monthPassPrice || 0;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Pass</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Gym Info Card */}
        <View style={styles.gymCard}>
          <Text style={styles.gymName}>{gym.name}</Text>
          <Text style={styles.gymAddress}>{gym.address}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {gym.rating} ({gym.reviewCount})</Text>
          </View>
        </View>

        {/* Pass Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Pass Type</Text>
          <View style={styles.passOptions}>
            {passOptions.map((option) => (
              <TouchableOpacity
                key={option.type}
                style={[
                  styles.passOption,
                  selectedPass === option.type && styles.passOptionSelected,
                ]}
                onPress={() => setSelectedPass(option.type)}
              >
                <View style={styles.passOptionContent}>
                  <Text style={[
                    styles.passLabel,
                    selectedPass === option.type && styles.passLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.passDuration,
                    selectedPass === option.type && styles.passDurationSelected,
                  ]}>
                    {option.duration}
                  </Text>
                </View>
                <Text style={[
                  styles.passPrice,
                  selectedPass === option.type && styles.passPriceSelected,
                ]}>
                  ${option.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.dateSection}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => handleDateChange(-1)}
            >
              <Text style={styles.dateButtonText}>← Prev</Text>
            </TouchableOpacity>

            <View style={styles.selectedDateDisplay}>
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
              <Text style={styles.dateHint}>
                {selectedPass === 'day' ? 'Valid for 24 hours' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => handleDateChange(1)}
            >
              <Text style={styles.dateButtonText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${getPrice(selectedPass).toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${getPrice(selectedPass).toFixed(2)}</Text>
          </View>
          <Text style={styles.platformFeeNote}>
            Scout takes 15% platform fee. Gym receives ${(getPrice(selectedPass) * 0.85).toFixed(2)}
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Sticky Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.black,
  },
  gymCard: {
    marginHorizontal: padding.md,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
  },
  gymName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  gymAddress: {
    ...typography.caption,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    marginTop: spacing.sm,
  },
  ratingText: {
    ...typography.small,
    color: colors.gray700,
  },
  section: {
    marginHorizontal: padding.md,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.black,
    marginBottom: spacing.md,
  },
  passOptions: {
    gap: spacing.md,
  },
  passOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  passOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  passOptionContent: {
    flex: 1,
  },
  passLabel: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  passLabelSelected: {
    color: colors.primary,
  },
  passDuration: {
    ...typography.caption,
    color: colors.gray600,
  },
  passDurationSelected: {
    color: colors.primary,
  },
  passPrice: {
    ...typography.h4,
    color: colors.gray700,
  },
  passPriceSelected: {
    color: colors.primary,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
  },
  dateButtonText: {
    ...typography.small,
    color: colors.gray700,
    fontWeight: '600',
  },
  selectedDateDisplay: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.orange50,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  selectedDateText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  dateHint: {
    ...typography.caption,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  summary: {
    marginHorizontal: padding.md,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.small,
    color: colors.gray700,
  },
  summaryValue: {
    ...typography.small,
    color: colors.black,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.subtitle,
    color: colors.black,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  platformFeeNote: {
    ...typography.caption,
    color: colors.gray600,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  spacer: {
    height: spacing.xl,
  },
  footer: {
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: padding.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray600,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.lg,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.md,
  },
  errorMessage: {
    ...typography.body,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
