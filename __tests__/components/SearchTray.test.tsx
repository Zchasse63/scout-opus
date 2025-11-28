import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock dependencies
const mockOnSearch = jest.fn();
const mockOnFilterChange = jest.fn();

jest.mock('../../hooks/useVoiceSearch', () => ({
  useVoiceSearch: () => ({
    recordingState: 'idle',
    transcript: '',
    partialTranscript: '',
    intent: null,
    isRecording: false,
    isProcessing: false,
    error: null,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    resetState: jest.fn(),
  }),
}));

jest.mock('../../hooks/useRecentSearches', () => ({
  useRecentSearches: () => ({
    recentSearches: [
      { query: 'yoga', type: 'text', timestamp: Date.now() },
      { query: 'crossfit', type: 'text', timestamp: Date.now() },
    ],
    addRecentSearch: jest.fn(),
    removeRecentSearch: jest.fn(),
    clearRecentSearches: jest.fn(),
    popularSearches: ['Yoga', 'CrossFit', 'Boxing'],
    timeSuggestions: ['Morning', 'Evening'],
  }),
}));

jest.mock('../../utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
    voice: jest.fn(),
  },
}));

jest.mock('../../components/search/FilterCarousel', () => {
  return function MockFilterCarousel() {
    return <div testID="filter-carousel">Filter Carousel</div>;
  };
});

jest.mock('../../components/search/StructuredSearchModal', () => ({
  StructuredSearchModal: () => <div testID="structured-search-modal">Modal</div>,
}));

jest.mock('../../components/voice/AudioWaveform', () => {
  return function MockAudioWaveform() {
    return <div testID="audio-waveform">Waveform</div>;
  };
});

jest.mock('../../components/voice/VoiceHints', () => {
  return function MockVoiceHints() {
    return <div testID="voice-hints">Hints</div>;
  };
});

import SearchTray from '../../components/search/SearchTray';

describe('SearchTray', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders in collapsed state initially', () => {
    render(<SearchTray onSearch={mockOnSearch} />);
    
    expect(screen.getByText('Where are you working out?')).toBeTruthy();
  });

  test('expands when tapped', () => {
    render(<SearchTray onSearch={mockOnSearch} />);
    
    const collapsedContent = screen.getByText('Where are you working out?');
    fireEvent.press(collapsedContent);
    
    expect(screen.getByPlaceholderText('Search gyms, amenities...')).toBeTruthy();
  });

  test('calls onSearch when search is submitted', async () => {
    render(<SearchTray onSearch={mockOnSearch} />);

    const collapsedContent = screen.getByText('Where are you working out?');
    fireEvent.press(collapsedContent);

    const searchInput = screen.getByPlaceholderText('Search gyms, amenities...');
    fireEvent.changeText(searchInput, 'yoga');

    // Trigger the onSubmitEditing callback
    searchInput.props.onSubmitEditing();

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('yoga');
    });
  });

  test('displays location name when provided', () => {
    render(<SearchTray onSearch={mockOnSearch} locationName="Miami, FL" />);
    
    expect(screen.getByText('Miami, FL')).toBeTruthy();
  });

  test('updates search text when input changes', async () => {
    render(<SearchTray onSearch={mockOnSearch} />);

    const collapsedContent = screen.getByText('Where are you working out?');
    fireEvent.press(collapsedContent);

    const searchInput = screen.getByPlaceholderText('Search gyms, amenities...');
    fireEvent.changeText(searchInput, 'yoga');

    expect(searchInput.props.value).toBe('yoga');
  });

  test('renders filter carousel in expanded state', () => {
    render(<SearchTray onSearch={mockOnSearch} />);
    
    const collapsedContent = screen.getByText('Where are you working out?');
    fireEvent.press(collapsedContent);
    
    expect(screen.getByTestId('filter-carousel')).toBeTruthy();
  });

  test('renders without crashing', () => {
    const { root } = render(<SearchTray onSearch={mockOnSearch} />);
    expect(root).toBeTruthy();
  });
});

