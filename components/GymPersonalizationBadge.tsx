import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GymPersonalizationBadgeProps {
  matchScore?: number;
  reasons?: string[];
  compact?: boolean;
}

/**
 * Displays personalized "Why this gym" badges based on user history
 */
export function GymPersonalizationBadge({
  matchScore,
  reasons,
  compact = false,
}: GymPersonalizationBadgeProps) {
  if (!reasons?.length) {
    return null;
  }

  // Determine badge color based on match score
  const getBadgeColor = () => {
    if (!matchScore) return '#6B7280'; // gray
    if (matchScore >= 80) return '#10B981'; // green
    if (matchScore >= 60) return '#3B82F6'; // blue
    return '#6B7280'; // gray
  };

  const badgeColor = getBadgeColor();

  if (compact) {
    // Show just the first reason as a small badge
    return (
      <View style={[styles.compactBadge, { backgroundColor: `${badgeColor}15` }]}>
        <Ionicons name="sparkles" size={12} color={badgeColor} />
        <Text style={[styles.compactText, { color: badgeColor }]} numberOfLines={1}>
          {reasons[0]}
        </Text>
      </View>
    );
  }

  // Full display with all reasons
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={14} color={badgeColor} />
        <Text style={[styles.headerText, { color: badgeColor }]}>
          {matchScore ? `${matchScore}% match` : 'Good for you'}
        </Text>
      </View>
      <View style={styles.reasonsContainer}>
        {reasons.slice(0, 3).map((reason, index) => (
          <View key={index} style={styles.reasonRow}>
            <Ionicons name="checkmark-circle" size={14} color={badgeColor} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reasonsContainer: {
    gap: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  compactText: {
    fontSize: 11,
    fontWeight: '500',
    maxWidth: 150,
  },
});

