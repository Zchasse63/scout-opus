import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';
import { supabase } from '../lib/supabase';
import type { VoiceQueryResult } from '../types';

type RecordingState = 'idle' | 'recording' | 'processing' | 'results';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseVoiceSearchReturn {
  recordingState: RecordingState;
  transcript: string;
  partialTranscript: string;
  intent: VoiceQueryResult | null;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  conversationHistory: ConversationMessage[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetState: () => void;
  clearConversation: () => void;
}

export function useVoiceSearch(): UseVoiceSearchReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [intent, setIntent] = useState<VoiceQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  // Keep track of the last intent for refinement queries
  const lastIntentRef = useRef<VoiceQueryResult | null>(null);
  const finalTranscriptRef = useRef<string>('');

  // Set up Voice event listeners
  useEffect(() => {
    const onSpeechStart = (_e: SpeechStartEvent) => {
      setRecordingState('recording');
      setPartialTranscript('');
      finalTranscriptRef.current = '';
    };

    const onSpeechEnd = (_e: SpeechEndEvent) => {
      // Speech ended, will process in stopRecording
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      // Final results - use the first (most confident) result
      if (e.value && e.value.length > 0) {
        finalTranscriptRef.current = e.value[0];
        setTranscript(e.value[0]);
      }
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      // Real-time partial results as user speaks
      if (e.value && e.value.length > 0) {
        setPartialTranscript(e.value[0]);
      }
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Speech recognition error:', e.error);
      setError(e.error?.message || 'Speech recognition failed');
      setRecordingState('idle');
    };

    // Register listeners
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    // Cleanup on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setPartialTranscript('');
      finalTranscriptRef.current = '';

      // Check if speech recognition is available
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        setError('Speech recognition is not available on this device');
        return;
      }

      // Start listening with locale
      await Voice.start('en-US');
      setRecordingState('recording');
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice recognition');
      setRecordingState('idle');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setRecordingState('processing');

      // Stop the voice recognition
      await Voice.stop();

      // Wait a brief moment for final results to arrive
      await new Promise(resolve => setTimeout(resolve, 300));

      const transcriptText = finalTranscriptRef.current || transcript;

      if (!transcriptText) {
        setError('No speech detected. Please try again.');
        setRecordingState('idle');
        return;
      }

      setTranscript(transcriptText);

      // Process transcript to extract search intent via voice-process-query
      // Pass conversation history and previous intent for refinement
      const { data: intentData, error: intentError } = await supabase.functions.invoke(
        'voice-process-query',
        {
          body: {
            transcript: transcriptText,
            conversationHistory: conversationHistory.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            previousIntent: lastIntentRef.current,
          },
        }
      );

      if (intentError) {
        throw intentError;
      }

      // Extract parsed intent from response
      const parsedIntent = intentData?.parsedIntent || null;

      // If this is a refinement, merge with previous intent
      let finalIntent = parsedIntent;
      if (parsedIntent?.is_refinement && lastIntentRef.current) {
        finalIntent = {
          ...lastIntentRef.current,
          ...parsedIntent,
          // Merge arrays instead of replacing
          facility_types: [
            ...new Set([
              ...(lastIntentRef.current.facilityTypes || []),
              ...(parsedIntent.facility_types || []),
            ]),
          ],
          required_amenities: [
            ...new Set([
              ...(lastIntentRef.current.amenities || []),
              ...(parsedIntent.required_amenities || []),
            ]),
          ],
        };
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: transcriptText },
        { role: 'assistant', content: JSON.stringify(finalIntent) },
      ]);

      // Store for next refinement
      lastIntentRef.current = finalIntent;

      setIntent(finalIntent);
      setRecordingState('results');
    } catch (err) {
      console.error('Failed to process voice search:', err);
      setError(err instanceof Error ? err.message : 'Failed to process voice search');
      setRecordingState('idle');
    }
  }, [transcript, conversationHistory]);

  const resetState = useCallback(() => {
    setRecordingState('idle');
    setTranscript('');
    setPartialTranscript('');
    setIntent(null);
    setError(null);
    // Keep conversation history for follow-up queries
  }, []);

  const clearConversation = useCallback(() => {
    setRecordingState('idle');
    setTranscript('');
    setPartialTranscript('');
    setIntent(null);
    setError(null);
    setConversationHistory([]);
    lastIntentRef.current = null;
  }, []);

  return {
    recordingState,
    transcript,
    partialTranscript,
    intent,
    isRecording: recordingState === 'recording',
    isProcessing: recordingState === 'processing',
    error,
    conversationHistory,
    startRecording,
    stopRecording,
    resetState,
    clearConversation,
  };
}
