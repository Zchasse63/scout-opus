import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { PassTypeSelector } from './PassTypeSelector';
import { DatePicker } from './DatePicker';
import { PriceBreakdown } from './PriceBreakdown';
import { WaiverModal } from './WaiverModal';

export type PassType = 'day' | 'week' | 'month';

interface CheckoutFormProps {
  gymId: string;
  gymName: string;
  dayPassPrice: number;
  weekPassPrice?: number;
  monthPassPrice?: number;
  onSuccess?: (bookingId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  gymId,
  gymName,
  dayPassPrice,
  weekPassPrice,
  monthPassPrice,
  onSuccess,
}) => {
  const router = useRouter();
  const { confirmPayment } = useStripe();

  const [passType, setPassType] = useState<PassType>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isWaiverVisible, setIsWaiverVisible] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPrice = (): number => {
    switch (passType) {
      case 'day':
        return dayPassPrice;
      case 'week':
        return weekPassPrice || dayPassPrice * 5;
      case 'month':
        return monthPassPrice || dayPassPrice * 20;
      default:
        return dayPassPrice;
    }
  };

  const price = getPrice();
  const platformFee = price * 0.15;
  const total = price + platformFee;

  const handlePayment = async () => {
    if (!waiverAccepted) {
      setIsWaiverVisible(true);
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter valid card details');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/payments-create-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            gymId,
            passType,
            bookingDate: selectedDate.toISOString(),
            amount: Math.round(total * 100), // Convert to cents
          }),
        }
      );

      const { clientSecret, bookingId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Confirm payment
      const { error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Success!
      Alert.alert(
        'Payment Successful',
        'Your booking has been confirmed!',
        [
          {
            text: 'View Pass',
            onPress: () => {
              if (onSuccess) {
                onSuccess(bookingId);
              } else {
                router.push('/passes');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWaiverAccepted = () => {
    setWaiverAccepted(true);
    setIsWaiverVisible(false);
    // Proceed with payment
    handlePayment();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Gym name */}
      <Text style={styles.gymName}>{gymName}</Text>

      {/* Pass type selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Pass Type</Text>
        <PassTypeSelector
          selectedType={passType}
          onSelect={setPassType}
          dayPrice={dayPassPrice}
          weekPrice={weekPassPrice}
          monthPrice={monthPassPrice}
        />
      </View>

      {/* Date picker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          passType={passType}
        />
      </View>

      {/* Payment details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardField}
          style={styles.cardContainer}
          onCardChange={(details) => setCardDetails(details)}
        />
      </View>

      {/* Price breakdown */}
      <View style={styles.section}>
        <PriceBreakdown
          passPrice={price}
          platformFee={platformFee}
          total={total}
        />
      </View>

      {/* Waiver checkbox */}
      <View style={styles.waiverSection}>
        <Text style={styles.waiverText}>
          {waiverAccepted
            ? '✓ Waiver accepted'
            : 'You will need to accept the waiver before booking'}
        </Text>
        {!waiverAccepted && (
          <Button
            title="View Waiver"
            onPress={() => setIsWaiverVisible(true)}
            variant="outline"
            size="small"
            style={styles.waiverButton}
          />
        )}
      </View>

      {/* Pay button */}
      <Button
        title={`Pay $${total.toFixed(2)}`}
        onPress={handlePayment}
        loading={isProcessing}
        disabled={isProcessing || !cardDetails?.complete}
        fullWidth
        style={styles.payButton}
      />

      {/* Waiver modal */}
      <WaiverModal
        visible={isWaiverVisible}
        gymName={gymName}
        onAccept={handleWaiverAccepted}
        onDecline={() => setIsWaiverVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  gymName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  cardContainer: {
    height: 50,
  },
  cardField: {
    backgroundColor: colors.white,
  },
  waiverSection: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  waiverText: {
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  waiverButton: {
    alignSelf: 'flex-start',
  },
  payButton: {
    marginBottom: spacing.xl,
  },
});
