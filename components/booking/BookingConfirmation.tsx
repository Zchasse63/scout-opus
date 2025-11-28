/**
 * BookingConfirmation - Success celebration with confetti and Apple Wallet
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Check, Wallet, Share2, Calendar, MapPin } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface BookingConfirmationProps {
  gymName: string;
  gymAddress: string;
  passType: string;
  date: Date;
  amount: number;
  confirmationCode: string;
  onAddToWallet?: () => void;
  onShare?: () => void;
  onViewPass?: () => void;
}

export function BookingConfirmation({
  gymName,
  gymAddress,
  passType,
  date,
  amount,
  confirmationCode,
  onAddToWallet,
  onShare,
  onViewPass,
}: BookingConfirmationProps) {
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();
    
    // Animate checkmark
    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.timing(contentOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Success checkmark */}
      <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }], opacity: checkOpacity }]}>
        <Check size={48} color={colors.white} strokeWidth={3} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your pass is ready to use</Text>

        {/* Confirmation code */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Confirmation Code</Text>
          <Text style={styles.code}>{confirmationCode}</Text>
        </View>

        {/* Booking details */}
        <View style={styles.detailsCard}>
          <Text style={styles.gymName}>{gymName}</Text>
          
          <View style={styles.detailRow}>
            <MapPin size={iconSizes.sm} color={colors.gray500} />
            <Text style={styles.detailText}>{gymAddress}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={iconSizes.sm} color={colors.gray500} />
            <Text style={styles.detailText}>{formatDate(date)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{passType}</Text>
            <Text style={styles.summaryValue}>${amount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.walletButton} onPress={onAddToWallet}>
            <Wallet size={iconSizes.md} color={colors.white} />
            <Text style={styles.walletButtonText}>Add to Apple Wallet</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onShare}>
              <Share2 size={iconSizes.md} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onViewPass}>
              <Text style={styles.secondaryButtonText}>View Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: padding.screenHorizontal, paddingTop: spacing.xxxl },
  checkCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  content: { width: '100%', alignItems: 'center' },
  title: { ...typography.h2, color: colors.black, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.gray600, marginBottom: spacing.xl },
  codeContainer: { alignItems: 'center', marginBottom: spacing.xl },
  codeLabel: { ...typography.small, color: colors.gray500, marginBottom: spacing.xs },
  code: { fontSize: 28, fontWeight: '700', color: colors.black, letterSpacing: 4 },
  detailsCard: { width: '100%', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  gymName: { ...typography.h4, color: colors.black, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  detailText: { ...typography.body, color: colors.gray700 },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...typography.body, color: colors.gray700 },
  summaryValue: { ...typography.h4, color: colors.black },
  actions: { width: '100%', gap: spacing.md },
  walletButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.black, paddingVertical: spacing.lg, borderRadius: radius.md },
  walletButtonText: { ...typography.bodyBold, color: colors.white },
  secondaryActions: { flexDirection: 'row', gap: spacing.md },
  secondaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.gray100, paddingVertical: spacing.md, borderRadius: radius.md },
  secondaryButtonText: { ...typography.bodyBold, color: colors.primary },
});

export default BookingConfirmation;

