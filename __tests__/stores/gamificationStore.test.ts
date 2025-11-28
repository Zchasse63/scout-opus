import { useGamificationStore } from '../../stores/gamificationStore';

// Mock supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

describe('useGamificationStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useGamificationStore.setState({
      totalPoints: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      gymsVisited: 0,
      citiesVisited: 0,
      totalWorkouts: 0,
      unlockedBadges: [],
      recentAchievements: [],
      leaderboardRank: null,
      leaderboardData: [],
      visitedCities: new Set<string>(),
      isLoading: false,
      isSyncing: false,
      isLeaderboardLoading: false,
      error: null,
    });
  });

  describe('Initial State', () => {
    test('initializes with zero points and level 1', () => {
      const state = useGamificationStore.getState();

      expect(state.totalPoints).toBe(0);
      expect(state.currentLevel).toBe(1);
      expect(state.currentStreak).toBe(0);
      expect(state.gymsVisited).toBe(0);
    });

    test('initializes with loading states as false', () => {
      const state = useGamificationStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.isSyncing).toBe(false);
      expect(state.isLeaderboardLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addPoints', () => {
    test('adds points to total', () => {
      const { addPoints } = useGamificationStore.getState();

      addPoints(50, 'Test reason');

      expect(useGamificationStore.getState().totalPoints).toBe(50);
    });

    test('creates achievement when adding points', () => {
      const { addPoints } = useGamificationStore.getState();

      addPoints(25, 'Gym check-in');

      const achievements = useGamificationStore.getState().recentAchievements;
      expect(achievements.length).toBe(1);
      expect(achievements[0].points).toBe(25);
      expect(achievements[0].description).toBe('Gym check-in');
    });

    test('accumulates points from multiple additions', () => {
      const { addPoints } = useGamificationStore.getState();

      addPoints(10, 'First');
      addPoints(20, 'Second');
      addPoints(30, 'Third');

      expect(useGamificationStore.getState().totalPoints).toBe(60);
    });
  });

  describe('unlockBadge', () => {
    test('unlocks a badge and adds points', () => {
      const { unlockBadge } = useGamificationStore.getState();

      unlockBadge('first_steps');

      const state = useGamificationStore.getState();
      expect(state.unlockedBadges).toContain('first_steps');
      expect(state.totalPoints).toBe(10); // first_steps badge is worth 10 points
    });

    test('does not unlock same badge twice', () => {
      const { unlockBadge } = useGamificationStore.getState();

      unlockBadge('first_steps');
      unlockBadge('first_steps');

      const state = useGamificationStore.getState();
      expect(state.unlockedBadges.filter(b => b === 'first_steps').length).toBe(1);
      expect(state.totalPoints).toBe(10); // Only awarded once
    });
  });

  describe('incrementGymsVisited', () => {
    test('increments gym count and awards points', () => {
      const { incrementGymsVisited } = useGamificationStore.getState();

      incrementGymsVisited();

      const state = useGamificationStore.getState();
      expect(state.gymsVisited).toBe(1);
      expect(state.totalWorkouts).toBe(1);
    });

    test('unlocks first_steps badge on first visit', () => {
      const { incrementGymsVisited } = useGamificationStore.getState();

      incrementGymsVisited();

      expect(useGamificationStore.getState().unlockedBadges).toContain('first_steps');
    });
  });

  describe('calculateLevel', () => {
    test('returns level 1 for 0 points', () => {
      const { calculateLevel } = useGamificationStore.getState();

      const level = calculateLevel();
      expect(level.level).toBe(1);
      expect(level.title).toBe('Beginner');
    });

    test('returns level 2 for 100+ points', () => {
      useGamificationStore.setState({ totalPoints: 150 });
      const { calculateLevel } = useGamificationStore.getState();

      const level = calculateLevel();
      expect(level.level).toBe(2);
      expect(level.title).toBe('Explorer');
    });

    test('returns level 5 for 1000+ points', () => {
      useGamificationStore.setState({ totalPoints: 1500 });
      const { calculateLevel } = useGamificationStore.getState();

      const level = calculateLevel();
      expect(level.level).toBe(5);
      expect(level.title).toBe('Champion');
    });
  });

  describe('clearError', () => {
    test('clears error state', () => {
      useGamificationStore.setState({ error: 'Some error' });

      const { clearError } = useGamificationStore.getState();
      clearError();

      expect(useGamificationStore.getState().error).toBeNull();
    });
  });
});

