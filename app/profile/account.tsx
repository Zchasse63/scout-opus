/**
 * Account Settings Screen - Account deletion (GDPR compliance)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, AlertTriangle, Trash2, Download, Shield } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useAuthStore } from '../../stores/authStore';

export default function AccountScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleExportData = () => {
    haptics.light();
    Alert.alert(
      'Export Your Data',
      'We\'ll prepare a download of all your data and send it to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Export', onPress: () => {
          haptics.success();
          Alert.alert('Request Sent', 'You\'ll receive an email with your data export within 24 hours.');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    haptics.warning();
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, passes, and history will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert(
            'Are you absolutely sure?',
            'Type DELETE to confirm account deletion.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'I understand, delete my account', style: 'destructive', onPress: () => {
                haptics.error();
                // TODO: Implement actual account deletion
                signOut();
                router.replace('/');
              }},
            ]
          );
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Data Privacy Section */}
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleExportData}>
            <View style={styles.iconContainer}>
              <Download size={iconSizes.md} color={colors.primary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Export Your Data</Text>
              <Text style={styles.rowDescription}>Download a copy of all your data</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Shield size={iconSizes.md} color={colors.success} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Privacy Settings</Text>
              <Text style={styles.rowDescription}>Your data is encrypted and secure</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
        <View style={styles.dangerCard}>
          <View style={styles.warningBanner}>
            <AlertTriangle size={iconSizes.md} color={colors.error} />
            <Text style={styles.warningText}>Actions here cannot be undone</Text>
          </View>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Trash2 size={iconSizes.md} color={colors.white} />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
          
          <Text style={styles.deleteDescription}>
            This will permanently delete your account, all passes, booking history, and personal data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  content: { flex: 1, padding: padding.screenHorizontal },
  sectionTitle: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs },
  dangerTitle: { color: colors.error },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.gray50, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  rowContent: { flex: 1 },
  rowLabel: { ...typography.bodyBold, color: colors.black },
  rowDescription: { ...typography.small, color: colors.gray500, marginTop: spacing.xxs },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: spacing.lg },
  dangerCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.errorLight },
  warningBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg },
  warningText: { ...typography.bodyBold, color: colors.error },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.error, padding: spacing.lg, borderRadius: radius.lg },
  deleteButtonText: { ...typography.bodyBold, color: colors.white },
  deleteDescription: { ...typography.small, color: colors.gray500, textAlign: 'center', marginTop: spacing.md },
});

