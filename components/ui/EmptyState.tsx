import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated, Easing } from 'react-native';
import { WifiOff, AlertCircle, RefreshCw, ServerCrash } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { durations, springConfigs } from '../../constants/animations';
import { Button } from './Button';
import { EmptyStateIcons, iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  animated?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
  animated = true,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: durations.normal, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, ...springConfigs.gentle, useNativeDriver: true }),
        Animated.spring(iconScale, { toValue: 1, ...springConfigs.bouncy, useNativeDriver: true }),
      ]).start();
    } else {
      opacity.setValue(1);
      translateY.setValue(0);
      iconScale.setValue(1);
    }
  }, [animated]);

  const handleAction = () => {
    haptics.light();
    onAction?.();
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }, style]}>
      {icon && (
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }] }]}>
          {icon}
        </Animated.View>
      )}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={handleAction} variant="primary" style={styles.button} />
      )}
    </Animated.View>
  );
};

// Preset empty states for common scenarios
export const EmptyGymList: React.FC<{ onSearch?: () => void }> = ({
  onSearch,
}) => (
  <EmptyState
    icon={
      <View style={styles.iconCircle}>
        <EmptyStateIcons.noGyms size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
      </View>
    }
    title="No Gyms Found"
    description="Try adjusting your search filters or location"
    actionLabel={onSearch ? 'Search Again' : undefined}
    onAction={onSearch}
  />
);

export const EmptyBookings: React.FC<{ onBrowse?: () => void }> = ({
  onBrowse,
}) => (
  <EmptyState
    icon={
      <View style={styles.iconCircle}>
        <EmptyStateIcons.noBookings size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
      </View>
    }
    title="No Bookings Yet"
    description="Book your first gym pass to get started"
    actionLabel={onBrowse ? 'Browse Gyms' : undefined}
    onAction={onBrowse}
  />
);

export const EmptyTrips: React.FC<{ onAddTrip?: () => void }> = ({
  onAddTrip,
}) => (
  <EmptyState
    icon={
      <View style={styles.iconCircle}>
        <EmptyStateIcons.noTrips size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
      </View>
    }
    title="No Trips Detected"
    description="We'll automatically detect your upcoming travel from your calendar"
    actionLabel={onAddTrip ? 'Add Trip Manually' : undefined}
    onAction={onAddTrip}
  />
);

export const EmptySavedGyms: React.FC<{ onExplore?: () => void }> = ({
  onExplore,
}) => (
  <EmptyState
    icon={
      <View style={styles.iconCircle}>
        <EmptyStateIcons.noSaved size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
      </View>
    }
    title="No Saved Gyms"
    description="Tap the heart icon on gyms you'd like to save for later"
    actionLabel={onExplore ? 'Explore Gyms' : undefined}
    onAction={onExplore}
  />
);

export const EmptySearchResults: React.FC<{ onClearFilters?: () => void }> = ({
  onClearFilters,
}) => (
  <EmptyState
    icon={
      <View style={styles.iconCircle}>
        <EmptyStateIcons.noResults size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
      </View>
    }
    title="No Results Found"
    description="Try different keywords or clear your filters"
    actionLabel={onClearFilters ? 'Clear Filters' : undefined}
    onAction={onClearFilters}
  />
);

// Error States
interface ErrorStateProps {
  type: 'network' | 'server' | 'generic';
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type,
  title,
  description,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  const config = {
    network: { icon: WifiOff, defaultTitle: 'No Internet Connection', defaultDesc: 'Check your connection and try again', color: colors.warning },
    server: { icon: ServerCrash, defaultTitle: 'Something Went Wrong', defaultDesc: 'Our servers are having issues. Please try again later.', color: colors.error },
    generic: { icon: AlertCircle, defaultTitle: 'Oops!', defaultDesc: 'Something unexpected happened. Please try again.', color: colors.gray500 },
  }[type];
  const Icon = config.icon;

  return (
    <EmptyState
      icon={<View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}><Icon size={iconSizes.xxl} color={config.color} /></View>}
      title={title || config.defaultTitle}
      description={description || config.defaultDesc}
      actionLabel={onRetry ? retryLabel : undefined}
      onAction={onRetry}
    />
  );
};

// Offline indicator banner
interface OfflineBannerProps { visible: boolean; }
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  useEffect(() => {
    Animated.spring(translateY, { toValue: visible ? 0 : -50, ...springConfigs.snappy, useNativeDriver: true }).start();
  }, [visible]);
  return (
    <Animated.View style={[styles.offlineBanner, { transform: [{ translateY }] }]}>
      <WifiOff size={iconSizes.sm} color={colors.white} />
      <Text style={styles.offlineBannerText}>No Internet Connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconContainer: { marginBottom: spacing.lg },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: typography.sizes.xl, fontWeight: '600', color: colors.black, textAlign: 'center', marginBottom: spacing.sm },
  description: { fontSize: typography.sizes.base, color: colors.gray500, textAlign: 'center', marginBottom: spacing.xl, maxWidth: 300 },
  button: { minWidth: 200 },
  offlineBanner: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.error, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingTop: spacing.xxl },
  offlineBannerText: { ...typography.smallBold, color: colors.white },
});
