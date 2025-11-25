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
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import FilterCarousel from './FilterCarousel';

type TrayState = 'collapsed' | 'expanded' | 'voice';

interface SearchTrayProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
}

export default function SearchTray({ onSearch, onFilterChange }: SearchTrayProps) {
  const [trayState, setTrayState] = useState<TrayState>('collapsed');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  const {
    recordingState,
    transcript,
    intent,
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    resetState,
  } = useVoiceSearch();

  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(0);

  // Handle voice recording start/stop
  const handleMicPress = useCallback(async () => {
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
      onSearch?.(searchText);
    }
  }, [searchText, onSearch]);

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
          <View style={styles.collapsedContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search gyms..."
              placeholderTextColor={colors.gray500}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMicPress}
              activeOpacity={0.7}
            >
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
          </View>
        );

      case 'expanded':
        return (
          <View style={styles.expandedContent}>
            <View style={styles.expandedHeader}>
              <TextInput
                style={styles.expandedSearchInput}
                placeholder="Search gyms..."
                placeholderTextColor={colors.gray500}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                autoFocus
              />
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleMicPress}
                activeOpacity={0.7}
              >
                <Text style={styles.micIcon}>🎤</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filtersSection}>
              <Text style={styles.filtersLabel}>Filters</Text>
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

        return (
          <View style={styles.voiceContent}>
            <View style={styles.pulsingMic}>
              <View style={styles.pulseRing1} />
              <View style={styles.pulseRing2} />
              <Text style={styles.micIcon}>🎤</Text>
            </View>
            <Text style={styles.listeningText}>
              {isProcessing ? 'Processing...' : 'Listening...'}
            </Text>
            <Text style={styles.voiceTranscriptText}>
              {isProcessing ? 'Transcribing and analyzing your request' : 'Say what you\'re looking for'}
            </Text>
            {transcript && (
              <Text style={styles.transcriptPreview}>
                "{transcript}"
              </Text>
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
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 20,
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
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.black,
  },
  filtersSection: {
    gap: spacing.md,
  },
  filtersLabel: {
    ...typography.smallBold,
    color: colors.gray700,
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
