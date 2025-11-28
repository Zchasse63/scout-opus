import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Mic, MicOff, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { AudioWaveform } from './AudioWaveform';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface VoiceRecordingViewProps {
  onTranscript: (transcript: string) => void;
  onClose: () => void;
  isListening?: boolean;
}

export const VoiceRecordingView: React.FC<VoiceRecordingViewProps> = ({
  onTranscript,
  onClose,
  isListening = false,
}) => {
  const {
    transcript,
    partialTranscript,
    intent,
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
  } = useVoiceSearch();

  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  // Show real-time transcript as user speaks
  const displayTranscript = isProcessing
    ? 'Processing...'
    : transcript || partialTranscript;

  useEffect(() => {
    if (isRecording) {
      // Pulse animation for mic button
      pulseScale.value = withRepeat(
        withTiming(1.2, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [isRecording]);

  // When intent is parsed, pass to parent
  useEffect(() => {
    if (intent && !isProcessing) {
      // Build search query from intent
      const searchQuery = intent.facilityTypes?.join(' ')
        || intent.amenities?.join(' ')
        || transcript;

      if (searchQuery) {
        onTranscript(searchQuery);
      }
    }
  }, [intent, isProcessing, transcript, onTranscript]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Voice recognition error:', error);
    }
  }, [error]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: isRecording ? 0.5 : 0,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleMicPress = async () => {
    buttonScale.value = withSpring(0.9, {}, () => {
      buttonScale.value = withSpring(1);
    });

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X color={colors.gray500} size={24} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        {isRecording ? 'Listening...' : 'Tap to speak'}
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        {isRecording
          ? 'Tell me what you\'re looking for'
          : 'Try: "Find a gym with a pool near me"'}
      </Text>

      {/* Waveform visualization */}
      <View style={styles.waveformContainer}>
        {isRecording ? (
          <AudioWaveform isActive={isRecording} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Mic button with pulse effect */}
      <View style={styles.micContainer}>
        {/* Pulse rings */}
        <Animated.View style={[styles.pulseRing, pulseStyle]} />
        <Animated.View
          style={[styles.pulseRing, pulseStyle, { opacity: 0.3 }]}
        />

        {/* Mic button */}
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && styles.micButtonActive,
            ]}
            onPress={handleMicPress}
            activeOpacity={0.8}
          >
            {isRecording ? (
              <MicOff color={colors.white} size={32} />
            ) : (
              <Mic color={colors.white} size={32} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Transcript display - shows real-time as user speaks */}
      {displayTranscript ? (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcript}>{displayTranscript}</Text>
        </View>
      ) : null}

      {/* Error display */}
      {error && (
        <View style={[styles.transcriptContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.transcript, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Instructions */}
      <Text style={styles.instructions}>
        {isProcessing ? 'Analyzing...' : isRecording ? 'Tap the mic to stop' : 'Speak naturally'}
      </Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.gray500,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  waveformContainer: {
    width: width - spacing.xl * 2,
    height: 100,
    marginBottom: spacing.xxl,
  },
  placeholder: {
    flex: 1,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: colors.error,
  },
  transcriptContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    minWidth: width - spacing.xl * 2,
  },
  transcript: {
    fontSize: typography.sizes.lg,
    color: colors.black,
    textAlign: 'center',
  },
  instructions: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
});
