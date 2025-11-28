/**
 * Voice Feedback Utilities
 * Provides audio and haptic feedback for voice interactions
 */
import { Audio } from 'expo-av';
import { haptics } from './haptics';

// Sound effect types
type SoundType = 'start' | 'stop' | 'success' | 'error' | 'processing';

// Sound cache
const soundCache: Map<SoundType, Audio.Sound> = new Map();

// Sound configurations (using system sounds or bundled assets)
const SOUND_CONFIG: Record<SoundType, { haptic: 'light' | 'medium' | 'heavy' | 'success' | 'error' }> = {
  start: { haptic: 'light' },
  stop: { haptic: 'light' },
  success: { haptic: 'success' },
  error: { haptic: 'error' },
  processing: { haptic: 'light' },
};

/**
 * Play voice feedback (haptic + optional sound)
 */
export async function playVoiceFeedback(type: SoundType): Promise<void> {
  const config = SOUND_CONFIG[type];
  
  // Always play haptic feedback
  switch (config.haptic) {
    case 'light':
      haptics.light();
      break;
    case 'medium':
      haptics.medium();
      break;
    case 'heavy':
      haptics.heavy();
      break;
    case 'success':
      haptics.success();
      break;
    case 'error':
      haptics.error();
      break;
  }

  // TODO: Add actual sound playback when sound assets are available
  // const sound = await loadSound(type);
  // if (sound) await sound.playAsync();
}

/**
 * Voice listening started
 */
export function onVoiceStart(): void {
  playVoiceFeedback('start');
}

/**
 * Voice listening stopped
 */
export function onVoiceStop(): void {
  playVoiceFeedback('stop');
}

/**
 * Voice command recognized successfully
 */
export function onVoiceSuccess(): void {
  playVoiceFeedback('success');
}

/**
 * Voice command failed or not recognized
 */
export function onVoiceError(): void {
  playVoiceFeedback('error');
}

/**
 * Voice is processing
 */
export function onVoiceProcessing(): void {
  playVoiceFeedback('processing');
}

/**
 * Cleanup sounds on app close
 */
export async function cleanupSounds(): Promise<void> {
  for (const sound of soundCache.values()) {
    await sound.unloadAsync();
  }
  soundCache.clear();
}

/**
 * Voice feedback hook for components
 */
export function useVoiceFeedback() {
  return {
    onStart: onVoiceStart,
    onStop: onVoiceStop,
    onSuccess: onVoiceSuccess,
    onError: onVoiceError,
    onProcessing: onVoiceProcessing,
  };
}

/**
 * Voice state feedback patterns
 */
export const voiceFeedbackPatterns = {
  // Listening started - single light tap
  listeningStart: () => haptics.light(),
  
  // Listening ended - double light tap
  listeningEnd: () => {
    haptics.light();
    setTimeout(() => haptics.light(), 100);
  },
  
  // Command recognized - success pattern
  commandRecognized: () => haptics.success(),
  
  // Command not understood - error pattern
  commandNotUnderstood: () => haptics.error(),
  
  // Processing - subtle pulse
  processing: () => haptics.light(),
  
  // Filter applied - medium tap
  filterApplied: () => haptics.medium(),
  
  // Search executed - success
  searchExecuted: () => haptics.success(),
};

