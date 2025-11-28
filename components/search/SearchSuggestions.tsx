/**
 * SearchSuggestions - Autocomplete dropdown with recent/popular/time-based suggestions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, TrendingUp, Sparkles, X, Mic, Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { useRecentSearches, type RecentSearch, POPULAR_SEARCHES, getTimeSuggestions } from '../../hooks/useRecentSearches';

interface SearchSuggestionsProps {
  isVisible: boolean;
  query?: string;
  onSuggestionPress: (query: string) => void;
  onClearRecent?: () => void;
  onRemoveRecent?: (id: string) => void;
  maxRecent?: number;
  maxPopular?: number;
}

export function SearchSuggestions({
  isVisible,
  query = '',
  onSuggestionPress,
  onClearRecent,
  onRemoveRecent,
  maxRecent = 5,
  maxPopular = 4,
}: SearchSuggestionsProps) {
  const { colors: themeColors } = useTheme();
  const { recentSearches, clearRecentSearches, removeRecentSearch } = useRecentSearches();
  const timeSuggestions = getTimeSuggestions();

  if (!isVisible) return null;

  const filteredRecent = recentSearches
    .filter(s => !query || s.query.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxRecent);

  const filteredPopular = POPULAR_SEARCHES
    .filter(s => !query || s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxPopular);

  const handlePress = (text: string) => {
    haptics.selection();
    onSuggestionPress(text);
  };

  const handleClear = () => {
    haptics.light();
    onClearRecent?.() || clearRecentSearches();
  };

  const handleRemove = (id: string) => {
    haptics.light();
    onRemoveRecent?.(id) || removeRecentSearch(id);
  };

  const renderSuggestionItem = (
    text: string,
    icon: React.ReactNode,
    key: string,
    isVoice?: boolean,
    onRemove?: () => void
  ) => (
    <TouchableOpacity
      key={key}
      style={styles.suggestionItem}
      onPress={() => handlePress(text)}
      accessibilityLabel={`Search for ${text}`}
      accessibilityRole="button"
    >
      <View style={styles.suggestionIcon}>{icon}</View>
      <Text style={[styles.suggestionText, { color: themeColors.text }]} numberOfLines={1}>{text}</Text>
      {isVoice && <Mic size={iconSizes.xs} color={colors.primary} style={{ marginLeft: 'auto' }} />}
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel={`Remove ${text}`}>
          <X size={iconSizes.sm} color={themeColors.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Recent searches */}
        {filteredRecent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Recent</Text>
              <TouchableOpacity onPress={handleClear} accessibilityLabel="Clear recent searches">
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {filteredRecent.map((search) =>
              renderSuggestionItem(
                search.query,
                <Clock size={iconSizes.sm} color={themeColors.textSecondary} />,
                search.id,
                search.type === 'voice',
                () => handleRemove(search.id)
              )
            )}
          </View>
        )}

        {/* Time-based suggestions */}
        {!query && timeSuggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Try now</Text>
            {timeSuggestions.map((suggestion, i) =>
              renderSuggestionItem(
                suggestion,
                <Sparkles size={iconSizes.sm} color={colors.info} />,
                `time-${i}`
              )
            )}
          </View>
        )}

        {/* Popular searches */}
        {filteredPopular.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>Popular</Text>
            {filteredPopular.map((suggestion, i) =>
              renderSuggestionItem(
                suggestion,
                <TrendingUp size={iconSizes.sm} color={colors.warning} />,
                `popular-${i}`
              )
            )}
          </View>
        )}

        {/* Voice hint */}
        {!query && (
          <View style={[styles.voiceHint, { backgroundColor: `${colors.primary}10` }]}>
            <Mic size={iconSizes.md} color={colors.primary} />
            <Text style={[styles.voiceHintText, { color: themeColors.text }]}>
              Try saying "Find gyms with a pool near me"
            </Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.sm },
  section: { paddingHorizontal: padding.screenHorizontal, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { ...typography.smallBold, textTransform: 'uppercase', letterSpacing: 0.5 },
  clearText: { ...typography.small, color: colors.primary },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  suggestionIcon: { width: 24, alignItems: 'center' },
  suggestionText: { ...typography.body, flex: 1 },
  voiceHint: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: padding.screenHorizontal, padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.md },
  voiceHintText: { ...typography.small, flex: 1 },
});

export default SearchSuggestions;

