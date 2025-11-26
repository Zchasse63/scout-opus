import { create } from 'zustand';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'exploration' | 'consistency' | 'social' | 'achievement';
  requirement: string;
  points: number;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  type: 'first_booking' | 'gym_visited' | 'streak' | 'review' | 'referral' | 'milestone';
  title: string;
  description: string;
  points: number;
  timestamp: string;
}

export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
}

interface GamificationStore {
  // User stats
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  gymsVisited: number;
  citiesVisited: number;
  totalWorkouts: number;

  // Badges
  badges: Badge[];
  unlockedBadges: string[];

  // Achievements
  recentAchievements: Achievement[];

  // Leaderboard
  leaderboardRank: number | null;
  leaderboardData: Array<{
    userId: string;
    username: string;
    points: number;
    rank: number;
    avatar?: string;
  }>;

  // Actions
  addPoints: (points: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  updateStreak: (checkInDate: string) => void;
  incrementGymsVisited: () => void;
  incrementCitiesVisited: (city: string) => void;
  setLeaderboard: (data: any[]) => void;
  calculateLevel: () => UserLevel;
  getProgressToNextLevel: () => { current: number; required: number; percentage: number };
}

// Level definitions
const LEVELS: UserLevel[] = [
  { level: 1, title: 'Beginner', minPoints: 0, maxPoints: 99, benefits: ['Basic features'] },
  { level: 2, title: 'Explorer', minPoints: 100, maxPoints: 249, benefits: ['Early access to new gyms'] },
  { level: 3, title: 'Regular', minPoints: 250, maxPoints: 499, benefits: ['5% discount on passes'] },
  { level: 4, title: 'Enthusiast', minPoints: 500, maxPoints: 999, benefits: ['10% discount on passes', 'Priority support'] },
  { level: 5, title: 'Champion', minPoints: 1000, maxPoints: 2499, benefits: ['15% discount', 'VIP badge', 'Monthly free pass'] },
  { level: 6, title: 'Legend', minPoints: 2500, maxPoints: Infinity, benefits: ['20% discount', 'Exclusive events', '2 monthly free passes'] },
];

// Badge definitions
const ALL_BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first gym visit',
    icon: '👟',
    category: 'exploration',
    requirement: 'Visit 1 gym',
    points: 10,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit gyms in 3 different cities',
    icon: '🗺️',
    category: 'exploration',
    requirement: 'Visit 3 cities',
    points: 50,
  },
  {
    id: 'globetrotter',
    name: 'Globetrotter',
    description: 'Visit gyms in 10 different cities',
    icon: '🌍',
    category: 'exploration',
    requirement: 'Visit 10 cities',
    points: 200,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    category: 'consistency',
    requirement: '7-day streak',
    points: 50,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day workout streak',
    icon: '💪',
    category: 'consistency',
    requirement: '30-day streak',
    points: 200,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Maintain a 100-day workout streak',
    icon: '🏆',
    category: 'consistency',
    requirement: '100-day streak',
    points: 1000,
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Leave your first gym review',
    icon: '⭐',
    category: 'social',
    requirement: 'Write 1 review',
    points: 20,
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Leave 10 helpful gym reviews',
    icon: '📝',
    category: 'social',
    requirement: 'Write 10 reviews',
    points: 100,
  },
  {
    id: 'century',
    name: 'Century Club',
    description: 'Complete 100 gym visits',
    icon: '💯',
    category: 'achievement',
    requirement: '100 visits',
    points: 500,
  },
];

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  // Initial state
  totalPoints: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  gymsVisited: 0,
  citiesVisited: 0,
  totalWorkouts: 0,
  badges: ALL_BADGES,
  unlockedBadges: [],
  recentAchievements: [],
  leaderboardRank: null,
  leaderboardData: [],

  addPoints: (points, reason) => {
    const newTotal = get().totalPoints + points;
    const achievement: Achievement = {
      id: `ach_${Date.now()}`,
      type: 'milestone',
      title: `+${points} points`,
      description: reason,
      points,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      totalPoints: newTotal,
      recentAchievements: [achievement, ...state.recentAchievements].slice(0, 10),
    }));

    // Check for level up
    const newLevel = get().calculateLevel();
    if (newLevel.level > get().currentLevel) {
      set({ currentLevel: newLevel.level });
      // TODO: Show level up notification
    }
  },

  unlockBadge: (badgeId) => {
    const badge = get().badges.find((b) => b.id === badgeId);
    if (!badge || get().unlockedBadges.includes(badgeId)) return;

    set((state) => ({
      unlockedBadges: [...state.unlockedBadges, badgeId],
      totalPoints: state.totalPoints + badge.points,
    }));

    // Add achievement
    const achievement: Achievement = {
      id: `badge_${badgeId}`,
      type: 'achievement',
      title: `Badge Unlocked: ${badge.name}`,
      description: badge.description,
      points: badge.points,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      recentAchievements: [achievement, ...state.recentAchievements].slice(0, 10),
    }));
  },

  addAchievement: (achievement) => {
    set((state) => ({
      recentAchievements: [achievement, ...state.recentAchievements].slice(0, 10),
      totalPoints: state.totalPoints + achievement.points,
    }));
  },

  updateStreak: (checkInDate) => {
    const today = new Date(checkInDate);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // TODO: Check last check-in date from database
    // For now, just increment
    const newStreak = get().currentStreak + 1;

    set({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, get().longestStreak),
    });

    // Check for streak badges
    if (newStreak === 7) {
      get().unlockBadge('week_warrior');
    } else if (newStreak === 30) {
      get().unlockBadge('unstoppable');
    } else if (newStreak === 100) {
      get().unlockBadge('iron_will');
    }
  },

  incrementGymsVisited: () => {
    const newCount = get().gymsVisited + 1;
    set({ gymsVisited: newCount, totalWorkouts: get().totalWorkouts + 1 });

    // Check for visit badges
    if (newCount === 1) {
      get().unlockBadge('first_steps');
    } else if (newCount === 100) {
      get().unlockBadge('century');
    }

    // Award points for visit
    get().addPoints(10, 'Gym check-in');
  },

  incrementCitiesVisited: (city) => {
    // TODO: Track unique cities
    const newCount = get().citiesVisited + 1;
    set({ citiesVisited: newCount });

    // Check for exploration badges
    if (newCount === 3) {
      get().unlockBadge('explorer');
    } else if (newCount === 10) {
      get().unlockBadge('globetrotter');
    }
  },

  setLeaderboard: (data) => {
    const userPoints = get().totalPoints;
    const userRank = data.findIndex((entry) => entry.points <= userPoints) + 1;

    set({
      leaderboardData: data,
      leaderboardRank: userRank > 0 ? userRank : data.length + 1,
    });
  },

  calculateLevel: () => {
    const points = get().totalPoints;
    return LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints) || LEVELS[0];
  },

  getProgressToNextLevel: () => {
    const currentLevel = get().calculateLevel();
    const points = get().totalPoints;

    if (currentLevel.level === LEVELS.length) {
      return { current: points, required: currentLevel.maxPoints, percentage: 100 };
    }

    const nextLevel = LEVELS[currentLevel.level];
    const current = points - currentLevel.minPoints;
    const required = nextLevel.minPoints - currentLevel.minPoints;
    const percentage = Math.min(100, (current / required) * 100);

    return { current, required, percentage };
  },
}));
