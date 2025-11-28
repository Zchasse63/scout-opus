import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, AppState, AppStateStatus } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Download, Sun, MapPin, CheckCircle, Star } from 'lucide-react-native';
import * as Brightness from 'expo-brightness';
import * as Location from 'expo-location';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { iconSizes } from '../../constants/icons';
import { Badge } from '../ui/Badge';
import { haptics } from '../../utils/haptics';

interface QRPassProps {
  bookingId: string;
  gymName: string;
  passType: string;
  bookingDate: string;
  qrCodeData: string;
  status: 'confirmed' | 'used' | 'cancelled';
  gymLocation?: { latitude: number; longitude: number };
  onAddToWallet?: () => void;
  onCheckInComplete?: () => void;
  onRequestReview?: () => void;
}

export const QRPass: React.FC<QRPassProps> = ({
  bookingId,
  gymName,
  passType,
  bookingDate,
  qrCodeData,
  status,
  gymLocation,
  onAddToWallet,
  onCheckInComplete,
  onRequestReview,
}) => {
  const [isBrightnessBoost, setIsBrightnessBoost] = useState(false);
  const [originalBrightness, setOriginalBrightness] = useState<number | null>(null);
  const [isNearGym, setIsNearGym] = useState(false);
  const [checkInState, setCheckInState] = useState<'pending' | 'checking' | 'complete'>('pending');

  // Brightness boost - auto-enable when QR is shown
  useEffect(() => {
    const boostBrightness = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          const current = await Brightness.getBrightnessAsync();
          setOriginalBrightness(current);
          await Brightness.setBrightnessAsync(1);
          setIsBrightnessBoost(true);
        }
      } catch (e) { /* Brightness not available */ }
    };
    if (status === 'confirmed') boostBrightness();
    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness).catch(() => {});
      }
    };
  }, [status]);

  // Geofence check - show QR automatically when near gym
  useEffect(() => {
    if (!gymLocation || status !== 'confirmed') return;
    let subscription: Location.LocationSubscription | null = null;
    const checkLocation = async () => {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (location) => {
          const distance = getDistanceFromLatLonInMeters(
            location.coords.latitude, location.coords.longitude,
            gymLocation.latitude, gymLocation.longitude
          );
          setIsNearGym(distance < 100); // Within 100m
        }
      );
    };
    checkLocation();
    return () => { subscription?.remove(); };
  }, [gymLocation, status]);

  const handleCheckIn = useCallback(() => {
    haptics.success();
    setCheckInState('checking');
    setTimeout(() => {
      setCheckInState('complete');
      onCheckInComplete?.();
      // Prompt for review after check-in
      setTimeout(() => onRequestReview?.(), 2000);
    }, 1500);
  }, [onCheckInComplete, onRequestReview]);

  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed': return <Badge label="Active" variant="success" />;
      case 'used': return <Badge label="Used" variant="neutral" />;
      case 'cancelled': return <Badge label="Cancelled" variant="error" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Brightness indicator */}
      {isBrightnessBoost && (
        <View style={styles.brightnessIndicator}>
          <Sun size={iconSizes.xs} color={colors.warning} />
          <Text style={styles.brightnessText}>Brightness boosted for scanning</Text>
        </View>
      )}

      {/* Geofence indicator */}
      {isNearGym && status === 'confirmed' && (
        <View style={styles.nearGymIndicator}>
          <MapPin size={iconSizes.xs} color={colors.success} />
          <Text style={styles.nearGymText}>You're at the gym!</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.gymName}>{gymName}</Text>
          <Text style={styles.passType}>{passType.toUpperCase()} PASS</Text>
        </View>
        {getStatusBadge()}
      </View>

      {/* QR Code */}
      <View style={[styles.qrContainer, checkInState === 'complete' && styles.qrContainerSuccess]}>
        {checkInState === 'complete' ? (
          <View style={styles.checkInSuccess}>
            <CheckCircle size={80} color={colors.success} />
            <Text style={styles.checkInSuccessText}>Checked In!</Text>
          </View>
        ) : (
          <QRCode value={qrCodeData} size={200} backgroundColor={colors.white} color={colors.black} />
        )}
      </View>

      {/* Check-in button when near gym */}
      {isNearGym && status === 'confirmed' && checkInState === 'pending' && (
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <CheckCircle size={iconSizes.md} color={colors.white} />
          <Text style={styles.checkInButtonText}>Check In Now</Text>
        </TouchableOpacity>
      )}

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking ID</Text>
          <Text style={styles.detailValue}>#{bookingId.slice(0, 8)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{new Date(bookingDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Add to Wallet button */}
      {status === 'confirmed' && onAddToWallet && (
        <TouchableOpacity style={styles.walletButton} onPress={onAddToWallet}>
          <Download color={colors.primary} size={iconSizes.md} />
          <Text style={styles.walletButtonText}>Add to Apple Wallet</Text>
        </TouchableOpacity>
      )}

      {/* Review prompt after check-in */}
      {checkInState === 'complete' && (
        <TouchableOpacity style={styles.reviewButton} onPress={onRequestReview}>
          <Star size={iconSizes.md} color={colors.warning} />
          <Text style={styles.reviewButtonText}>Rate Your Visit</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.instructions}>
        {checkInState === 'complete' ? 'Enjoy your workout!' : 'Show this QR code at the gym entrance for check-in'}
      </Text>
    </View>
  );
};

// Helper function to calculate distance
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: 20, padding: spacing.xl, shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  brightnessIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.warningLight, borderRadius: radius.full, marginBottom: spacing.md },
  brightnessText: { ...typography.tiny, color: colors.warning },
  nearGymIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.successLight, borderRadius: radius.full, marginBottom: spacing.md },
  nearGymText: { ...typography.tinyBold, color: colors.success },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  gymName: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.black, marginBottom: spacing.xs },
  passType: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.primary, letterSpacing: 1 },
  qrContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, padding: spacing.lg, backgroundColor: colors.white, borderRadius: 16, borderWidth: 2, borderColor: colors.gray100, minHeight: 240 },
  qrContainerSuccess: { borderColor: colors.success, backgroundColor: colors.successLight },
  checkInSuccess: { alignItems: 'center', gap: spacing.md },
  checkInSuccessText: { ...typography.h2, color: colors.success },
  checkInButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, backgroundColor: colors.success, borderRadius: radius.md, marginBottom: spacing.lg },
  checkInButtonText: { ...typography.bodyBold, color: colors.white },
  details: { marginBottom: spacing.lg },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  detailLabel: { fontSize: typography.sizes.base, color: colors.gray500 },
  detailValue: { fontSize: typography.sizes.base, fontWeight: '600', color: colors.black },
  walletButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 2, borderColor: colors.primary, marginBottom: spacing.md },
  walletButtonText: { fontSize: typography.sizes.base, fontWeight: '600', color: colors.primary },
  reviewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.warningLight, marginBottom: spacing.md },
  reviewButtonText: { ...typography.bodyBold, color: colors.warning },
  instructions: { fontSize: typography.sizes.sm, color: colors.gray500, textAlign: 'center' },
});
