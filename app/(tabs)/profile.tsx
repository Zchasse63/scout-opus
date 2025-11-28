import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreditCard, Settings, Bell, HelpCircle, User, Heart, Ticket, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../constants/colors';
import { padding, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { GymPassport } from '../../components/profile/GymPassport';
import { Achievements, Achievement } from '../../components/profile/Achievements';
import { ProfileMenuSection, MenuItem } from '../../components/profile/ProfileMenuSection';
import { haptics } from '../../utils/haptics';

// Mock achievements data
const mockAchievements: Achievement[] = [
  { id: '1', name: 'First Visit', description: 'Complete your first gym visit', icon: 'star', unlocked: true },
  { id: '2', name: 'Explorer', description: 'Visit 5 different gyms', icon: 'target', unlocked: true },
  { id: '3', name: 'Globetrotter', description: 'Visit gyms in 3 cities', icon: 'medal', unlocked: false, progress: 2, maxProgress: 3 },
  { id: '4', name: 'Consistent', description: '7-day streak', icon: 'zap', unlocked: false, progress: 4, maxProgress: 7 },
  { id: '5', name: 'Champion', description: '30-day streak', icon: 'crown', unlocked: false, progress: 4, maxProgress: 30 },
];

export default function ProfileTab() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const memberSince = user?.created_at ? new Date(user.created_at) : new Date();

  const accountItems: MenuItem[] = [
    { id: 'favorites', label: 'Saved Gyms', icon: Heart, badge: 3, onPress: () => router.push('/favorites') },
    { id: 'passes', label: 'Active Passes', icon: Ticket, badge: 1, onPress: () => router.push('/(tabs)/passes') },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard, onPress: () => router.push('/profile/payment-methods') },
  ];

  const settingsItems: MenuItem[] = [
    { id: 'preferences', label: 'Preferences', icon: Settings, onPress: () => router.push('/profile/preferences') },
    { id: 'notifications', label: 'Notifications', icon: Bell, onPress: () => router.push('/profile/notifications') },
    { id: 'account', label: 'Account', icon: User, onPress: () => router.push('/profile/account') },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, onPress: () => router.push('/profile/help') },
  ];

  const dangerItems: MenuItem[] = [
    { id: 'signout', label: 'Sign Out', icon: LogOut, destructive: true, onPress: () => { haptics.medium(); signOut(); } },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={userName}
          email={user?.email || ''}
          avatarUrl={user?.user_metadata?.avatar_url}
          memberSince={memberSince}
          onEditPress={() => router.push('/profile/edit')}
          onAvatarPress={() => router.push('/profile/edit')}
        />

        <GymPassport
          totalVisits={12}
          citiesVisited={4}
          currentStreak={4}
          longestStreak={14}
        />

        <Achievements
          achievements={mockAchievements}
          onViewAll={() => { /* TODO: Achievements screen */ }}
        />

        <ProfileMenuSection title="Account" items={accountItems} />
        <ProfileMenuSection title="Settings" items={settingsItems} />
        <ProfileMenuSection items={dangerItems} />

        <Text style={styles.version}>Scout v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  version: {
    ...typography.small,
    color: colors.gray400,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
