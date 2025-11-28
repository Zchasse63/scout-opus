/**
 * Notifications Settings Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Bell, Tag, Calendar, MapPin, Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    { id: 'push', label: 'Push Notifications', description: 'Receive push notifications', icon: Bell, enabled: true },
    { id: 'deals', label: 'Deals & Promotions', description: 'Special offers and discounts', icon: Tag, enabled: true },
    { id: 'trips', label: 'Trip Reminders', description: 'Reminders for upcoming trips', icon: Calendar, enabled: true },
    { id: 'nearby', label: 'Nearby Gyms', description: 'Alerts when near partner gyms', icon: MapPin, enabled: false },
    { id: 'reviews', label: 'Review Requests', description: 'Reminders to leave reviews', icon: Star, enabled: true },
  ]);

  const toggleSetting = (id: string) => {
    haptics.light();
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {settings.map((setting, index) => (
            <View key={setting.id} style={[styles.row, index < settings.length - 1 && styles.rowBorder]}>
              <View style={styles.iconContainer}>
                <setting.icon size={iconSizes.md} color={colors.gray600} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>{setting.label}</Text>
                <Text style={styles.description}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.gray300, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          You can also manage notifications in your device settings.
        </Text>
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
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.gray50, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  textContainer: { flex: 1 },
  label: { ...typography.bodyBold, color: colors.black },
  description: { ...typography.small, color: colors.gray500, marginTop: spacing.xxs },
  footer: { ...typography.small, color: colors.gray500, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
});

