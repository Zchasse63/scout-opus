import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Search, Mic, X, Clock, TrendingUp, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { haptics } from '../../utils/haptics';
import FilterCarousel from './FilterCarousel';
import { StructuredSearchModal } from './StructuredSearchModal';
import { AudioWaveform } from '../voice/AudioWaveform';
import { VoiceHints } from '../voice/VoiceHints';

type TrayState = 'collapsed' | 'expanded' | 'voice';

interface SearchTrayProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
  locationName?: string;
}

export default function SearchTray({ onSearch, onFilterChange, locationName }: SearchTrayProps) {
  const [trayState, setTrayState] = useState<TrayState>('collapsed');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [showStructuredSearch, setShowStructuredSearch] = useState(false);

  const {
    recordingState,
    transcript,
    partialTranscript,
    intent,
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    resetState,
  } = useVoiceSearch();

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    popularSearches,
    timeSuggestions,
  } = useRecentSearches();

  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(0);

  // Handle voice recording start/stop
  const handleMicPress = useCallback(async () => {
    haptics.voice();
    if (trayState !== 'voice') {
      setTrayState('voice');
      await startRecording();
    } else {
      await stopRecording();
    }
  }, [trayState, startRecording, stopRecording]);

  // Handle voice results
  useEffect(() => {
    if (recordingState === 'results' && transcript) {
      // If we have an intent, use it; otherwise use raw transcript as search
      const searchQuery = intent?.location?.query || transcript;
      setSearchText(searchQuery);
      onSearch?.(searchQuery);
      resetState();
      setTrayState('collapsed');
    }
  }, [recordingState, transcript, intent, onSearch, resetState]);

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      addRecentSearch(searchText, 'text');
      onSearch?.(searchText);
      setTrayState('collapsed');
    }
  }, [searchText, onSearch, addRecentSearch]);

  const handleSuggestionPress = useCallback((query: string) => {
    haptics.light();
    setSearchText(query);
    addRecentSearch(query, 'text');
    onSearch?.(query);
    setTrayState('collapsed');
  }, [onSearch, addRecentSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const handleOpenStructuredSearch = useCallback(() => {
    haptics.light();
    setShowStructuredSearch(true);
  }, []);

  const handleStructuredSearch = useCallback((params: { location: string; gymTypes: string[]; date: Date | null }) => {
    // Build search query from structured params
    let query = '';
    if (params.location) query += params.location;
    if (params.gymTypes.length > 0) query += ` ${params.gymTypes.join(', ')}`;
    if (query.trim()) {
      setSearchText(query.trim());
      addRecentSearch(query.trim(), 'text');
      onSearch?.(query.trim());
    }
    setShowStructuredSearch(false);
    setTrayState('collapsed');
  }, [onSearch, addRecentSearch]);

  const toggleFilter = useCallback(
    (filterId: string) => {
      const newFilters = filters.includes(filterId)
        ? filters.filter((f) => f !== filterId)
        : [...filters, filterId];
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  const renderContent = () => {
    switch (trayState) {
      case 'collapsed':
        return (
          <TouchableOpacity
            style={styles.collapsedContent}
            onPress={() => setTrayState('expanded')}
            activeOpacity={0.9}
          >
            <View style={styles.searchIconContainer}>
              <Search size={iconSizes.md} color={colors.gray500} />
            </View>
            <View style={styles.collapsedTextContainer}>
              <Text style={styles.collapsedPlaceholder}>
                {searchText || 'Where are you working out?'}
              </Text>
              {locationName && (
                <View style={styles.locationRow}>
                  <MapPin size={iconSizes.xs} color={colors.gray500} />
                  <Text style={styles.locationText}>{locationName}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMicPress}
              activeOpacity={0.7}
            >
              <Mic size={iconSizes.md} color={colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        );

      case 'expanded':
        return (
          <View style={styles.expandedContent}>
            <View style={styles.expandedHeader}>
              <View style={styles.searchInputContainer}>
                <Search size={iconSizes.sm} color={colors.gray500} />
                <TextInput
                  style={styles.expandedSearchInput}
                  placeholder="Search gyms, amenities..."
                  placeholderTextColor={colors.gray500}
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={handleSearch}
                  autoFocus
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={handleClearSearch}>
                    <X size={iconSizes.sm} color={colors.gray500} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleMicPress}
                activeOpacity={0.7}
              >
                <Mic size={iconSizes.md} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchText && (
              <View style={styles.suggestionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearButton}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.slice(0, 3).map((search) => (
                  <TouchableOpacity
                    key={search.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(search.query)}
                  >
                    <Clock size={iconSizes.sm} color={colors.gray500} />
                    <Text style={styles.suggestionText}>{search.query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Popular Searches */}
            {!searchText && (
              <View style={styles.suggestionsSection}>
                <Text style={styles.sectionTitle}>Popular</Text>
                {popularSearches.slice(0, 3).map((query, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(query)}
                  >
                    <TrendingUp size={iconSizes.sm} color={colors.primary} />
                    <Text style={styles.suggestionText}>{query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.filtersSection}>
              <View style={styles.filterHeader}>
                <Text style={styles.filtersLabel}>Filters</Text>
                <TouchableOpacity
                  style={styles.advancedFiltersButton}
                  onPress={handleOpenStructuredSearch}
                >
                  <SlidersHorizontal size={iconSizes.sm} color={colors.primary} />
                  <Text style={styles.advancedFiltersText}>More options</Text>
                </TouchableOpacity>
              </View>
              <FilterCarousel selectedFilters={filters} onFilterChange={toggleFilter} />
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={!searchText.trim()}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        );

      case 'voice':
        if (error) {
          return (
            <View style={styles.voiceContent}>
              <Text style={styles.errorText}>❌</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  resetState();
                  setTrayState('collapsed');
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          );
        }

        // Show real-time transcript as user speaks
        const displayTranscript = transcript || partialTranscript;

        return (
          <View style={styles.voiceContent}>
            {/* Waveform visualization */}
            <View style={styles.waveformContainer}>
              <AudioWaveform isActive={isRecording} barCount={20} />
            </View>

            <View style={styles.pulsingMic}>
              <View style={styles.pulseRing1} />
              <View style={styles.pulseRing2} />
              <Mic size={iconSizes.xl} color={colors.white} />
            </View>
            <Text style={styles.listeningText}>
              {isProcessing ? 'Processing...' : 'Listening...'}
            </Text>

            {displayTranscript ? (
              <Text style={styles.transcriptPreview}>
                "{displayTranscript}"
              </Text>
            ) : (
              <VoiceHints compact onHintPress={(hint) => setSearchText(hint)} />
            )}

            <TouchableOpacity
              style={[styles.stopButton, isProcessing && styles.processingButton]}
              onPress={handleMicPress}
              disabled={isProcessing}
            >
              <Text style={styles.stopButtonText}>
                {isProcessing ? 'Processing...' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => trayState === 'expanded' && setTrayState('collapsed')}
        style={[styles.container, trayState !== 'collapsed' && styles.expandedContainer]}
      >
        <View
          style={[
            styles.tray,
            trayState === 'collapsed' && styles.collapsedTray,
            trayState === 'expanded' && styles.expandedTray,
            trayState === 'voice' && styles.voiceTray,
          ]}
        >
          {renderContent()}
        </View>
      </TouchableOpacity>

      <StructuredSearchModal
        visible={showStructuredSearch}
        onClose={() => setShowStructuredSearch(false)}
        onSearch={handleStructuredSearch}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  expandedContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tray: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: padding.screenHorizontal,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.sm,
  },
  collapsedTray: {
    marginBottom: spacing.lg,
  },
  expandedTray: {
    minHeight: 400,
  },
  voiceTray: {
    minHeight: 300,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchIconContainer: {
    marginRight: spacing.sm,
  },
  collapsedTextContainer: {
    flex: 1,
  },
  collapsedPlaceholder: {
    ...typography.body,
    color: colors.gray600,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  locationText: {
    ...typography.small,
    color: colors.gray500,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.black,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    gap: spacing.lg,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  expandedSearchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
    color: colors.black,
  },
  suggestionsSection: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.smallBold,
    color: colors.gray700,
  },
  clearButton: {
    ...typography.small,
    color: colors.primary,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    color: colors.gray800,
  },
  filtersSection: {
    gap: spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersLabel: {
    ...typography.smallBold,
    color: colors.gray700,
  },
  advancedFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  advancedFiltersText: {
    ...typography.small,
    color: colors.primary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  searchButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  voiceContent: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  pulsingMic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waveformContainer: {
    height: 60,
    width: '100%',
    marginBottom: spacing.md,
  },
  pulseRing1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.5,
  },
  pulseRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.3,
  },
  listeningText: {
    ...typography.h4,
    color: colors.black,
  },
  voiceTranscriptText: {
    ...typography.body,
    color: colors.gray700,
  },
  stopButton: {
    backgroundColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  stopButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  transcriptPreview: {
    ...typography.body,
    color: colors.gray700,
    fontStyle: 'italic',
    marginVertical: spacing.md,
  },
  processingButton: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    ...typography.h4,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...typography.body,
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.gray400,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  closeButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
