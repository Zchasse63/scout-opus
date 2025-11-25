import { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useBookingStore } from '../../stores/bookingStore';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { selectedGym, passType, selectedDate } = useBookingStore();
  const [qrValue, setQrValue] = useState('');

  // Generate QR code value (booking ID)
  useEffect(() => {
    const bookingId = `SCOUT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setQrValue(bookingId);
  }, []);

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

  const getValidityText = (): string => {
    switch (passType) {
      case 'day':
        return 'Valid for 24 hours from first use';
      case 'week':
        return 'Valid for 7 days from first use';
      case 'month':
        return 'Valid for 30 days from first use';
      default:
        return 'Valid from first use';
    }
  };

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `I just booked a ${getPassLabel()} at ${selectedGym.name} on Scout! 💪\n\nQR Code: ${qrValue}`,
        title: 'Booking Confirmation',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [qrValue, selectedGym.name, passType]);

  const handleDownload = useCallback(() => {
    // TODO: In Phase 3, implement Apple Wallet integration
    console.log('Add to Apple Wallet:', qrValue);
  }, [qrValue]);

  const totalAmount = getPrice();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your pass is ready to use
          </Text>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>Your Pass QR Code</Text>
          <View style={styles.qrContainer}>
            {qrValue && (
              <QRCode
                value={qrValue}
                size={200}
                backgroundColor={colors.white}
                color={colors.black}
              />
            )}
          </View>
          <Text style={styles.bookingId}>{qrValue}</Text>
          <Text style={styles.qrNote}>
            Show this QR code at the gym entrance
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailsCard}>
            <DetailRow label="Pass Type" value={getPassLabel()} />
            <Divider />
            <DetailRow label="Gym" value={selectedGym.name} />
            <Divider />
            <DetailRow label="Date" value={selectedDate || 'N/A'} />
            <Divider />
            <DetailRow label="Amount Paid" value={`$${totalAmount.toFixed(2)}`} />
            <Divider />
            <DetailRow
              label="Validity"
              value={getValidityText()}
              isSmall
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gym Location</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>{selectedGym.name}</Text>
            <Text style={styles.locationAddress}>{selectedGym.address}</Text>
            <TouchableOpacity style={styles.directionsButton}>
              <Text style={styles.directionsText}>📍 Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Important Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              • This pass is valid for {passType === 'day' ? 'one day' : passType === 'week' ? 'seven days' : 'thirty days'}
            </Text>
            <Text style={styles.infoText}>
              • Pass begins upon first use at the gym
            </Text>
            <Text style={styles.infoText}>
              • Non-transferable and non-refundable
            </Text>
            <Text style={styles.infoText}>
              • Show your QR code at check-in
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.walletButton}
          onPress={handleDownload}
        >
          <Text style={styles.walletButtonText}>📱 Add to Apple Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.navigate('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  isSmall?: boolean;
}

function DetailRow({ label, value, isSmall }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, isSmall && styles.detailLabelSmall]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, isSmall && styles.detailValueSmall]}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.green600,
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.white,
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    marginHorizontal: padding.md,
  },
  qrLabel: {
    ...typography.subtitle,
    color: colors.black,
    marginBottom: spacing.md,
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray100,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  bookingId: {
    ...typography.caption,
    color: colors.gray600,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  qrNote: {
    ...typography.small,
    color: colors.gray600,
    fontStyle: 'italic',
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
  detailsCard: {
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  detailLabel: {
    ...typography.body,
    color: colors.gray600,
    flex: 1,
  },
  detailLabelSmall: {
    ...typography.small,
  },
  detailValue: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
  },
  detailValueSmall: {
    ...typography.small,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  locationCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
  },
  locationName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  locationAddress: {
    ...typography.body,
    color: colors.gray600,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  directionsButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  directionsText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  infoCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.blue50,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue500,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: colors.blue700,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.small,
    color: colors.blue600,
    marginBottom: spacing.xs,
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
    gap: spacing.md,
  },
  walletButton: {
    backgroundColor: colors.primary,
    paddingVertical: padding.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  walletButtonText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: colors.gray100,
    paddingVertical: padding.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  shareButtonText: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: colors.green600,
    paddingVertical: padding.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.lg,
    marginHorizontal: padding.md,
  },
  backButton: {
    marginTop: spacing.lg,
    marginHorizontal: padding.md,
    paddingHorizontal: padding.md,
    paddingVertical: padding.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
