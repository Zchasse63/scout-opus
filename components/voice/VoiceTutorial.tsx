/**
 * Voice Tutorial - Onboarding for voice commands
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Search, MapPin, Filter, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { Button } from '../ui/Button';

const { width } = Dimensions.get('window');

interface VoiceTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  { icon: Mic, title: 'Voice Search', description: 'Tap the microphone and say what you\'re looking for', example: '"Find gyms near me"', color: colors.primary },
  { icon: Filter, title: 'Voice Filters', description: 'Apply filters with your voice', example: '"Show gyms under $20 with pools"', color: colors.blue500 },
  { icon: MapPin, title: 'Location Commands', description: 'Navigate the map hands-free', example: '"Show gyms in downtown"', color: colors.success },
  { icon: Sparkles, title: 'Smart Suggestions', description: 'Get personalized recommendations', example: '"Find a gym for strength training"', color: colors.warning },
];

export function VoiceTutorial({ onComplete, onSkip }: VoiceTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateToStep = (step: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep(step);
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  const handleNext = () => {
    haptics.light();
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      animateToStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    haptics.light();
    if (currentStep > 0) animateToStep(currentStep - 1);
  };

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={[styles.iconCircle, { backgroundColor: step.color + '20' }]}>
          <Icon size={iconSizes.xxl} color={step.color} />
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Try saying:</Text>
          <Text style={styles.exampleText}>{step.example}</Text>
        </View>
      </Animated.View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {TUTORIAL_STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentStep && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.buttons}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
              <ChevronLeft size={iconSizes.md} color={colors.gray500} />
            </TouchableOpacity>
          )}
          <Button title={currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} style={styles.nextButton} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  skipButton: { position: 'absolute', top: spacing.xl, right: spacing.lg, zIndex: 10, padding: spacing.sm },
  skipText: { ...typography.small, color: colors.gray500 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.md },
  description: { ...typography.body, color: colors.gray600, textAlign: 'center', marginBottom: spacing.xl },
  exampleContainer: { backgroundColor: colors.gray50, borderRadius: radius.lg, padding: spacing.lg, width: '100%' },
  exampleLabel: { ...typography.tiny, color: colors.gray500, marginBottom: spacing.xs },
  exampleText: { ...typography.bodyBold, color: colors.primary, fontStyle: 'italic' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray200 },
  dotActive: { backgroundColor: colors.primary, width: 24 },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  navButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },
  nextButton: { flex: 1 },
});

