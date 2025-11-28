/**
 * ReviewSummary - AI-generated summary of reviews highlighting key themes
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, ThumbsUp, ThumbsDown, Quote, ChevronRight, Info } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Skeleton } from '../ui/Skeleton';

interface ReviewHighlight {
  id: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category?: string;
  frequency?: number; // how many reviews mention this
}

interface ReviewSummaryProps {
  summary?: string;
  highlights?: ReviewHighlight[];
  positiveCount?: number;
  negativeCount?: number;
  isLoading?: boolean;
  onLearnMorePress?: () => void;
  accessibilityLabel?: string;
}

export function ReviewSummary({
  summary,
  highlights = [],
  positiveCount = 0,
  negativeCount = 0,
  isLoading = false,
  onLearnMorePress,
  accessibilityLabel,
}: ReviewSummaryProps) {
  const { colors: themeColors } = useTheme();

  const positiveHighlights = highlights.filter(h => h.sentiment === 'positive').slice(0, 3);
  const negativeHighlights = highlights.filter(h => h.sentiment === 'negative').slice(0, 2);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.card }]} accessibilityLabel="Loading review summary">
        <View style={styles.header}>
          <View style={styles.aiLabel}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton width={100} height={16} />
          </View>
        </View>
        <Skeleton width="100%" height={60} />
        <View style={styles.highlightsContainer}>
          <Skeleton width={150} height={32} borderRadius={radius.full} />
          <Skeleton width={130} height={32} borderRadius={radius.full} />
        </View>
      </View>
    );
  }

  if (!summary && highlights.length === 0) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.card }]}
      accessibilityLabel={accessibilityLabel || 'AI-generated review summary'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.aiLabel, { backgroundColor: `${colors.info}15` }]}>
          <Sparkles size={iconSizes.sm} color={colors.info} />
          <Text style={[styles.aiLabelText, { color: colors.info }]}>AI Summary</Text>
        </View>
        {onLearnMorePress && (
          <TouchableOpacity
            onPress={() => { haptics.light(); onLearnMorePress(); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Learn more about AI summaries"
          >
            <Info size={iconSizes.sm} color={themeColors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Summary text */}
      {summary && (
        <View style={styles.summaryContainer}>
          <Quote size={iconSizes.md} color={themeColors.textSecondary} style={{ opacity: 0.5 }} />
          <Text style={[styles.summaryText, { color: themeColors.text }]}>{summary}</Text>
        </View>
      )}

      {/* Sentiment stats */}
      {(positiveCount > 0 || negativeCount > 0) && (
        <View style={styles.sentimentRow}>
          <View style={styles.sentimentItem}>
            <ThumbsUp size={iconSizes.sm} color={colors.success} />
            <Text style={[styles.sentimentText, { color: colors.success }]}>
              {positiveCount} positive mentions
            </Text>
          </View>
          {negativeCount > 0 && (
            <View style={styles.sentimentItem}>
              <ThumbsDown size={iconSizes.sm} color={colors.error} />
              <Text style={[styles.sentimentText, { color: colors.error }]}>
                {negativeCount} concerns
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Highlights */}
      {(positiveHighlights.length > 0 || negativeHighlights.length > 0) && (
        <View style={styles.highlightsContainer}>
          <Text style={[styles.highlightsTitle, { color: themeColors.text }]}>Common themes</Text>
          <View style={styles.highlightsList}>
            {positiveHighlights.map(h => (
              <View key={h.id} style={[styles.highlightChip, styles.highlightPositive]}>
                <ThumbsUp size={iconSizes.xs} color={colors.success} />
                <Text style={[styles.highlightText, { color: colors.success }]}>{h.text}</Text>
                {h.frequency && <Text style={styles.highlightCount}>({h.frequency})</Text>}
              </View>
            ))}
            {negativeHighlights.map(h => (
              <View key={h.id} style={[styles.highlightChip, styles.highlightNegative]}>
                <ThumbsDown size={iconSizes.xs} color={colors.error} />
                <Text style={[styles.highlightText, { color: colors.error }]}>{h.text}</Text>
                {h.frequency && <Text style={styles.highlightCount}>({h.frequency})</Text>}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CTA */}
      {onLearnMorePress && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => { haptics.light(); onLearnMorePress(); }}
          accessibilityLabel="Read all reviews"
        >
          <Text style={styles.ctaText}>Read all reviews</Text>
          <ChevronRight size={iconSizes.sm} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  aiLabelText: { ...typography.smallBold },
  summaryContainer: { flexDirection: 'row', gap: spacing.sm },
  summaryText: { ...typography.body, flex: 1, lineHeight: 22, fontStyle: 'italic' },
  sentimentRow: { flexDirection: 'row', gap: spacing.lg },
  sentimentItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sentimentText: { ...typography.small },
  highlightsContainer: { gap: spacing.sm },
  highlightsTitle: { ...typography.smallBold },
  highlightsList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  highlightChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  highlightPositive: { backgroundColor: `${colors.success}15` },
  highlightNegative: { backgroundColor: `${colors.error}15` },
  highlightText: { ...typography.small },
  highlightCount: { ...typography.tiny, color: colors.gray500 },
  ctaButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray200 },
  ctaText: { ...typography.bodyBold, color: colors.primary },
});

export default ReviewSummary;

