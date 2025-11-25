import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../constants/colors';
import { padding, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function ProfileTab() {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        {user && (
          <>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: padding.screenHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  email: {
    ...typography.body,
    color: colors.gray700,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  signOutText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
