/**
 * PaymentSheet - Payment method selection and processing
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { CreditCard, Apple, ChevronRight, Plus, Check, AlertCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface SavedCard {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

interface PaymentSheetProps {
  amount: number;
  savedCards?: SavedCard[];
  onPaymentMethodSelect: (method: string, cardId?: string) => void;
  onAddCard?: () => void;
  isProcessing?: boolean;
  error?: string;
}

const CARD_ICONS: Record<string, string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png',
};

export function PaymentSheet({
  amount,
  savedCards = [],
  onPaymentMethodSelect,
  onAddCard,
  isProcessing = false,
  error,
}: PaymentSheetProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleSelect = (method: string, cardId?: string) => {
    haptics.selection();
    setSelectedMethod(method);
    onPaymentMethodSelect(method, cardId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={iconSizes.sm} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Apple Pay */}
      <TouchableOpacity
        style={[styles.paymentOption, selectedMethod === 'apple_pay' && styles.paymentOptionSelected]}
        onPress={() => handleSelect('apple_pay')}
        disabled={isProcessing}
      >
        <View style={styles.paymentOptionLeft}>
          <Apple size={iconSizes.lg} color={colors.black} />
          <Text style={styles.paymentOptionText}>Apple Pay</Text>
        </View>
        {selectedMethod === 'apple_pay' && <Check size={iconSizes.md} color={colors.primary} />}
      </TouchableOpacity>

      {/* Google Pay */}
      <TouchableOpacity
        style={[styles.paymentOption, selectedMethod === 'google_pay' && styles.paymentOptionSelected]}
        onPress={() => handleSelect('google_pay')}
        disabled={isProcessing}
      >
        <View style={styles.paymentOptionLeft}>
          <View style={styles.googlePayIcon}>
            <Text style={styles.googlePayText}>G</Text>
          </View>
          <Text style={styles.paymentOptionText}>Google Pay</Text>
        </View>
        {selectedMethod === 'google_pay' && <Check size={iconSizes.md} color={colors.primary} />}
      </TouchableOpacity>

      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          {savedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.paymentOption, selectedMethod === card.id && styles.paymentOptionSelected]}
              onPress={() => handleSelect('card', card.id)}
              disabled={isProcessing}
            >
              <View style={styles.paymentOptionLeft}>
                <CreditCard size={iconSizes.lg} color={colors.gray600} />
                <View>
                  <Text style={styles.paymentOptionText}>•••• {card.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {card.expiryMonth}/{card.expiryYear}</Text>
                </View>
              </View>
              {selectedMethod === card.id && <Check size={iconSizes.md} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Add new card */}
      <TouchableOpacity style={styles.addCardButton} onPress={onAddCard} disabled={isProcessing}>
        <Plus size={iconSizes.md} color={colors.primary} />
        <Text style={styles.addCardText}>Add new card</Text>
        <ChevronRight size={iconSizes.md} color={colors.gray400} />
      </TouchableOpacity>

      {/* Processing indicator */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.processingText}>Processing payment...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  title: { ...typography.h4, color: colors.black, marginBottom: spacing.sm },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: radius.md },
  errorText: { ...typography.small, color: colors.error, flex: 1 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200 },
  paymentOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  paymentOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  paymentOptionText: { ...typography.body, color: colors.black },
  googlePayIcon: { width: 24, height: 24, borderRadius: 4, backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  googlePayText: { fontSize: 16, fontWeight: '700', color: colors.gray700 },
  sectionTitle: { ...typography.smallBold, color: colors.gray600, marginTop: spacing.md },
  cardExpiry: { ...typography.tiny, color: colors.gray500 },
  addCardButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.gray100, borderRadius: radius.md },
  addCardText: { ...typography.body, color: colors.primary, flex: 1 },
  processingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  processingText: { ...typography.body, color: colors.gray700, marginTop: spacing.md },
});

export default PaymentSheet;

