/**
 * ProfileMenuSection - Reusable menu section for profile screen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  onPress: () => void;
  destructive?: boolean;
}

interface ProfileMenuSectionProps {
  title?: string;
  items: MenuItem[];
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === 0 && styles.menuItemFirst,
              index === items.length - 1 && styles.menuItemLast,
            ]}
            onPress={() => {
              haptics.light();
              item.onPress();
            }}
          >
            <View style={[styles.iconContainer, item.destructive && styles.iconContainerDestructive]}>
              <item.icon 
                size={iconSizes.md} 
                color={item.destructive ? colors.error : colors.gray700} 
              />
            </View>
            <Text style={[styles.menuLabel, item.destructive && styles.menuLabelDestructive]}>
              {item.label}
            </Text>
            <View style={styles.rightContent}>
              {item.badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={iconSizes.sm} color={colors.gray400} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.small,
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  menuItemFirst: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  menuItemLast: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerDestructive: {
    backgroundColor: colors.errorLight,
  },
  menuLabel: {
    ...typography.body,
    color: colors.black,
    flex: 1,
  },
  menuLabelDestructive: {
    color: colors.error,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.tinyBold,
    color: colors.white,
  },
});

export default ProfileMenuSection;

