import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { supabase } from '../lib/supabase';
import type { VoiceQueryResult } from '../types';

type RecordingState = 'idle' | 'recording' | 'processing' | 'results';

interface UseVoiceSearchReturn {
  recordingState: RecordingState;
  transcript: string;
  intent: VoiceQueryResult | null;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetState: () => void;
}

export function useVoiceSearch(): UseVoiceSearchReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [intent, setIntent] = useState<VoiceQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        setError('Microphone permission denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setRecordingState('recording');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    try {
      setRecordingState('processing');
      await recording.stopAndUnloadAsync();

      // Get the URI of the recorded audio
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      // Read the audio file as base64
      const audioBase64 = await readFileAsBase64(uri);

      // Send to transcription service via Edge Function
      const { data, error: transcribeError } = await supabase.functions.invoke(
        'voice-process-query',
        {
          body: {
            audioData: audioBase64,
            mimeType: 'audio/wav',
          },
        }
      );

      if (transcribeError) {
        throw transcribeError;
      }

      // Extract transcript and intent from response
      const { transcript: newTranscript, intent: parsedIntent } = data;

      setTranscript(newTranscript || 'Could not transcribe audio');
      setIntent(parsedIntent || null);
      setRecordingState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
      setRecordingState('idle');
    }
  }, [recording]);

  const resetState = useCallback(() => {
    setRecordingState('idle');
    setTranscript('');
    setIntent(null);
    setError(null);
  }, []);

  return {
    recordingState,
    transcript,
    intent,
    isRecording: recordingState === 'recording',
    isProcessing: recordingState === 'processing',
    error,
    startRecording,
    stopRecording,
    resetState,
  };
}

/**
 * Helper function to read a file from URI and convert to base64
 * Note: In production, we'd use expo-file-system, but for now we use a fetch-based approach
 */
async function readFileAsBase64(uri: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Error reading file as base64:', err);
    throw new Error('Failed to process audio file');
  }
}
