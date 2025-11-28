/**
 * Payment Methods Screen - Saved cards management
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Plus, Trash2, Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = React.useState<PaymentMethod[]>([
    { id: '1', type: 'visa', last4: '4242', expiryMonth: 12, expiryYear: 2026, isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', expiryMonth: 6, expiryYear: 2025, isDefault: false },
  ]);

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳 Visa';
      case 'mastercard': return '💳 Mastercard';
      case 'amex': return '💳 Amex';
      default: return '💳 Card';
    }
  };

  const setDefault = (id: string) => {
    haptics.medium();
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const deleteCard = (id: string) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        haptics.medium();
        setMethods(prev => prev.filter(m => m.id !== id));
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {methods.map((method) => (
          <View key={method.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <CreditCard size={iconSizes.lg} color={colors.gray700} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardType}>{getCardIcon(method.type)}</Text>
                <Text style={styles.cardNumber}>•••• {method.last4}</Text>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Check size={iconSizes.xs} color={colors.white} />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.expiry}>Expires {method.expiryMonth}/{method.expiryYear}</Text>
            <View style={styles.actions}>
              {!method.isDefault && (
                <TouchableOpacity onPress={() => setDefault(method.id)} style={styles.actionButton}>
                  <Text style={styles.actionText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteCard(method.id)} style={styles.deleteButton}>
                <Trash2 size={iconSizes.sm} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={() => { haptics.light(); /* TODO: Add card flow */ }}>
          <Plus size={iconSizes.md} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  content: { flex: 1, padding: padding.screenHorizontal, paddingTop: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  cardType: { ...typography.bodyBold, color: colors.black },
  cardNumber: { ...typography.body, color: colors.gray600 },
  defaultBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, backgroundColor: colors.success, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.full },
  defaultText: { ...typography.tinyBold, color: colors.white },
  expiry: { ...typography.small, color: colors.gray500 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray100 },
  actionButton: { paddingVertical: spacing.xs },
  actionText: { ...typography.bodyBold, color: colors.primary },
  deleteButton: { padding: spacing.xs },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.gray200, borderStyle: 'dashed' },
  addButtonText: { ...typography.bodyBold, color: colors.primary },
});

