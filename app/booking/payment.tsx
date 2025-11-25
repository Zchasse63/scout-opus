import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useBookingStore } from '../../stores/bookingStore';
import { supabase } from '../../lib/supabase';

export default function PaymentScreen() {
  const router = useRouter();
  const { selectedGym, passType, selectedDate, setIsProcessing } = useBookingStore();
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setProcessingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedGym || !passType) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorTitle}>Invalid Booking</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getPrice = (): number => {
    switch (passType) {
      case 'day':
        return selectedGym.dayPassPrice;
      case 'week':
        return selectedGym.weekPassPrice || 0;
      case 'month':
        return selectedGym.monthPassPrice || 0;
      default:
        return 0;
    }
  };

  const handlePayment = useCallback(async () => {
    if (!cardholderName.trim()) {
      setError('Please enter cardholder name');
      return;
    }

    setProcessingState(true);
    setError(null);

    try {
      const totalAmount = getPrice();
      const platformFee = Math.round(totalAmount * 0.15 * 100); // 15% in cents
      const gymPayout = Math.round(totalAmount * 0.85 * 100); // 85% in cents

      // Call Edge Function to create payment intent
      const { data, error: paymentError } = await supabase.functions.invoke(
        'payments-create-intent',
        {
          body: {
            amount: Math.round(totalAmount * 100), // Convert to cents
            description: `${passType.charAt(0).toUpperCase() + passType.slice(1)} Pass - ${selectedGym.name}`,
            metadata: {
              gymId: selectedGym.id,
              gymName: selectedGym.name,
              passType,
              bookingDate: selectedDate,
              cardholder: cardholderName,
              platformFee,
              gymPayout,
            },
          },
        }
      );

      if (paymentError) {
        throw paymentError;
      }

      if (data?.clientSecret) {
        // In Phase 3, would integrate with Stripe Payment Sheet
        // For now, simulate successful payment
        console.log('Payment Intent Created:', data.clientSecret);

        // Navigate to confirmation screen
        router.push('/booking/confirmation');
      } else {
        setError('Failed to create payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessingState(false);
    }
  }, [cardholderName, getPrice, selectedGym, passType, selectedDate, router]);

  const getPassLabel = (): string => {
    switch (passType) {
      case 'day':
        return 'Day Pass';
      case 'week':
        return 'Week Pass';
      case 'month':
        return 'Month Pass';
      default:
        return 'Pass';
    }
  };

  const totalAmount = getPrice();
  const platformFee = totalAmount * 0.15;
  const gymPayout = totalAmount * 0.85;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSmall}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>{getPassLabel()}</Text>
              <Text style={styles.value}>${totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{selectedDate || 'N/A'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value} numberOfLines={1}>
                {selectedGym.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Pass Price</Text>
              <Text style={styles.breakdownValue}>${totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Scout Platform Fee (15%)</Text>
              <Text style={styles.breakdownValue}>-${platformFee.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Gym Receives (85%)</Text>
              <Text style={[styles.breakdownValue, { color: colors.green600 }]}>
                ${gymPayout.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Cardholder Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cardholder Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.gray500}
            value={cardholderName}
            onChangeText={setCardholderName}
            editable={!isProcessing}
          />
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Note about Stripe */}
        <View style={styles.section}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>💳 Payment Method</Text>
            <Text style={styles.noteText}>
              In production, this would redirect to Stripe Payment Sheet for secure card processing.
              Your payment information is never stored on our servers.
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Sticky Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payButtonText}>
              Pay ${totalAmount.toFixed(2)}
            </Text>
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
  backButtonSmall: {
    padding: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.black,
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
  summaryCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.body,
    color: colors.gray700,
  },
  value: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
  },
  breakdownCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    ...typography.small,
    color: colors.gray600,
  },
  breakdownValue: {
    ...typography.small,
    color: colors.black,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...typography.body,
    color: colors.black,
  },
  errorCard: {
    marginHorizontal: padding.md,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.error + '15',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.lg,
    marginHorizontal: padding.md,
  },
  noteCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.blue50,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue500,
  },
  noteTitle: {
    ...typography.bodyBold,
    color: colors.blue700,
    marginBottom: spacing.sm,
  },
  noteText: {
    ...typography.small,
    color: colors.blue600,
    lineHeight: 18,
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
  payButton: {
    backgroundColor: colors.primary,
    paddingVertical: padding.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
  },
});
