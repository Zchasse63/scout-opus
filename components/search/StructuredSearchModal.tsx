/**
 * StructuredSearchModal - Full-screen Airbnb-style search modal
 * Where / What / When structured search experience
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { X, ChevronLeft, Search, Mic } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { LocationPicker } from './LocationPicker';
import { GymTypePicker } from './GymTypePicker';
import { SearchDatePicker } from './SearchDatePicker';

type SearchStep = 'where' | 'what' | 'when';

interface SearchState {
  location: string;
  gymTypes: string[];
  date: Date | null;
}

interface StructuredSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (params: SearchState) => void;
  initialStep?: SearchStep;
}

const STEPS: SearchStep[] = ['where', 'what', 'when'];

export function StructuredSearchModal({
  visible,
  onClose,
  onSearch,
  initialStep = 'where',
}: StructuredSearchModalProps) {
  const [currentStep, setCurrentStep] = useState<SearchStep>(initialStep);
  const [searchState, setSearchState] = useState<SearchState>({
    location: '',
    gymTypes: [],
    date: null,
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleBack = useCallback(() => {
    haptics.light();
    if (isFirstStep) {
      onClose();
    } else {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  }, [currentStepIndex, isFirstStep, onClose]);

  const handleNext = useCallback(() => {
    haptics.light();
    if (isLastStep) {
      onSearch(searchState);
      onClose();
    } else {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  }, [currentStepIndex, isLastStep, searchState, onSearch, onClose]);

  const handleSkip = useCallback(() => {
    haptics.light();
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  }, [currentStepIndex, isLastStep]);

  const handleClearAll = useCallback(() => {
    setSearchState({ location: '', gymTypes: [], date: null });
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'where':
        return (
          <LocationPicker
            value={searchState.location}
            onChange={(location) => setSearchState((s) => ({ ...s, location }))}
          />
        );
      case 'what':
        return (
          <GymTypePicker
            value={searchState.gymTypes}
            onChange={(gymTypes) => setSearchState((s) => ({ ...s, gymTypes }))}
          />
        );
      case 'when':
        return (
          <SearchDatePicker
            value={searchState.date}
            onChange={(date) => setSearchState((s) => ({ ...s, date }))}
          />
        );
    }
  };

  const getNextButtonLabel = (): string => {
    if (isLastStep) return 'Search';
    return 'Next';
  };

  const hasAnySelection = searchState.location || searchState.gymTypes.length > 0 || searchState.date;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            {isFirstStep ? (
              <X size={iconSizes.lg} color={colors.black} />
            ) : (
              <ChevronLeft size={iconSizes.lg} color={colors.black} />
            )}
          </TouchableOpacity>
          
          {/* Step indicators */}
          <View style={styles.stepIndicators}>
            {STEPS.map((step, index) => (
              <View
                key={step}
                style={[
                  styles.stepDot,
                  index === currentStepIndex && styles.stepDotActive,
                  index < currentStepIndex && styles.stepDotCompleted,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={isLastStep}>
            <Text style={[styles.skipText, isLastStep && styles.skipTextDisabled]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {renderStepContent()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {hasAnySelection && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            {isLastStep && <Search size={iconSizes.sm} color={colors.white} />}
            <Text style={styles.nextButtonText}>{getNextButtonLabel()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.gray200,
  },
  backButton: { padding: spacing.sm },
  stepIndicators: { flexDirection: 'row', gap: spacing.sm },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray300 },
  stepDotActive: { backgroundColor: colors.primary, width: 24 },
  stepDotCompleted: { backgroundColor: colors.primary },
  skipButton: { padding: spacing.sm },
  skipText: { ...typography.body, color: colors.gray600 },
  skipTextDisabled: { opacity: 0.3 },
  content: { flex: 1 },
  contentContainer: { padding: padding.screenHorizontal, paddingTop: spacing.xl },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.gray200,
  },
  clearText: { ...typography.bodyBold, color: colors.gray700, textDecorationLine: 'underline' },
  nextButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  nextButtonText: { ...typography.bodyBold, color: colors.white },
});

export default StructuredSearchModal;

