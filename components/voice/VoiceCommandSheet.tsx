/**
 * Voice Command Cheat Sheet - Quick reference for voice commands
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, Filter, MapPin, Calendar, Star, DollarSign, Dumbbell, Mic } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface VoiceCommandSheetProps {
  onClose: () => void;
}

const COMMAND_CATEGORIES = [
  {
    title: 'Search',
    icon: Search,
    color: colors.primary,
    commands: [
      { phrase: '"Find gyms near me"', description: 'Search nearby gyms' },
      { phrase: '"Gyms in [city name]"', description: 'Search in specific location' },
      { phrase: '"CrossFit gyms"', description: 'Search by gym type' },
    ],
  },
  {
    title: 'Filters',
    icon: Filter,
    color: colors.blue500,
    commands: [
      { phrase: '"Under $20"', description: 'Filter by price' },
      { phrase: '"With pool"', description: 'Filter by amenity' },
      { phrase: '"Open now"', description: 'Show open gyms' },
      { phrase: '"4 stars or higher"', description: 'Filter by rating' },
    ],
  },
  {
    title: 'Map',
    icon: MapPin,
    color: colors.success,
    commands: [
      { phrase: '"Show on map"', description: 'Switch to map view' },
      { phrase: '"Zoom in/out"', description: 'Adjust map zoom' },
      { phrase: '"Downtown area"', description: 'Move to location' },
    ],
  },
  {
    title: 'Booking',
    icon: Calendar,
    color: colors.warning,
    commands: [
      { phrase: '"Book for tomorrow"', description: 'Quick booking' },
      { phrase: '"Day pass"', description: 'Select pass type' },
      { phrase: '"Morning session"', description: 'Set time preference' },
    ],
  },
];

export function VoiceCommandSheet({ onClose }: VoiceCommandSheetProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Mic size={iconSizes.lg} color={colors.primary} />
          <Text style={styles.title}>Voice Commands</Text>
        </View>
        <TouchableOpacity onPress={() => { haptics.light(); onClose(); }} style={styles.closeButton}>
          <X size={iconSizes.md} color={colors.gray500} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {COMMAND_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <View key={category.title} style={styles.category}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Icon size={iconSizes.sm} color={category.color} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              {category.commands.map((cmd, i) => (
                <View key={i} style={styles.command}>
                  <Text style={styles.phrase}>{cmd.phrase}</Text>
                  <Text style={styles.description}>{cmd.description}</Text>
                </View>
              ))}
            </View>
          );
        })}
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>Combine commands for faster results: "Find CrossFit gyms under $30 with showers"</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.h3 },
  closeButton: { padding: spacing.sm },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  category: { marginTop: spacing.xl },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  categoryIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  categoryTitle: { ...typography.bodyBold },
  command: { backgroundColor: colors.gray50, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  phrase: { ...typography.smallBold, color: colors.primary, marginBottom: spacing.xxs },
  description: { ...typography.tiny, color: colors.gray500 },
  tip: { backgroundColor: colors.orange50, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.xxl },
  tipTitle: { ...typography.smallBold, marginBottom: spacing.xs },
  tipText: { ...typography.small, color: colors.gray600 },
});

