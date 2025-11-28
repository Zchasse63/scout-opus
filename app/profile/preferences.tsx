/**
 * Preferences Screen - Theme, units, default location settings
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Moon, Sun, Smartphone, MapPin, Ruler } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

type ThemeMode = 'light' | 'dark' | 'system';
type DistanceUnit = 'miles' | 'km';

export default function PreferencesScreen() {
  const router = useRouter();
  const [theme, setTheme] = React.useState<ThemeMode>('system');
  const [distanceUnit, setDistanceUnit] = React.useState<DistanceUnit>('miles');
  const [defaultLocation, setDefaultLocation] = React.useState('Current Location');

  const themeOptions = [
    { value: 'light' as ThemeMode, label: 'Light', icon: Sun },
    { value: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
    { value: 'system' as ThemeMode, label: 'System', icon: Smartphone },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.optionGroup}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionButton, theme === option.value && styles.optionButtonActive]}
                onPress={() => { haptics.light(); setTheme(option.value); }}
              >
                <option.icon size={iconSizes.md} color={theme === option.value ? colors.white : colors.gray600} />
                <Text style={[styles.optionLabel, theme === option.value && styles.optionLabelActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Distance Unit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance Unit</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Ruler size={iconSizes.md} color={colors.gray600} />
              <Text style={styles.rowLabel}>Use Kilometers</Text>
              <Switch
                value={distanceUnit === 'km'}
                onValueChange={(val) => { haptics.light(); setDistanceUnit(val ? 'km' : 'miles'); }}
                trackColor={{ false: colors.gray300, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Default Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Location</Text>
          <TouchableOpacity style={styles.card} onPress={() => { haptics.light(); /* TODO: Location picker */ }}>
            <View style={styles.row}>
              <MapPin size={iconSizes.md} color={colors.gray600} />
              <Text style={styles.rowLabel}>{defaultLocation}</Text>
              <Text style={styles.rowValue}>Change</Text>
            </View>
          </TouchableOpacity>
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
  section: { marginTop: spacing.xl },
  sectionTitle: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, marginLeft: spacing.xs },
  optionGroup: { flexDirection: 'row', gap: spacing.sm },
  optionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.gray200 },
  optionButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionLabel: { ...typography.bodyBold, color: colors.gray600 },
  optionLabelActive: { color: colors.white },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowLabel: { ...typography.body, color: colors.black, flex: 1 },
  rowValue: { ...typography.bodyBold, color: colors.primary },
});

