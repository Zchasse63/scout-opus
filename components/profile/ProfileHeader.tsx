/**
 * ProfileHeader - Avatar, name, member since, edit button
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Camera, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  memberSince: Date;
  onEditPress: () => void;
  onAvatarPress: () => void;
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  memberSince,
  onEditPress,
  onAvatarPress,
}: ProfileHeaderProps) {
  const formatMemberSince = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => {
          haptics.light();
          onAvatarPress();
        }}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.cameraButton}>
          <Camera size={iconSizes.sm} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.memberSince}>Member since {formatMemberSince(memberSince)}</Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          haptics.light();
          onEditPress();
        }}
      >
        <Text style={styles.editText}>Edit Profile</Text>
        <ChevronRight size={iconSizes.sm} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray200,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h3,
    color: colors.black,
    marginBottom: spacing.xxs,
  },
  email: {
    ...typography.body,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  memberSince: {
    ...typography.small,
    color: colors.gray500,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  editText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});

export default ProfileHeader;

