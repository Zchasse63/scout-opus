import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Text style={styles.title}>{title}</Text>

      {description && <Text style={styles.description}>{description}</Text>}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

// Preset empty states for common scenarios
export const EmptyGymList: React.FC<{ onSearch?: () => void }> = ({
  onSearch,
}) => (
  <EmptyState
    icon={<Text style={styles.emoji}>🏋️</Text>}
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
    icon={<Text style={styles.emoji}>🎟️</Text>}
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
    icon={<Text style={styles.emoji}>✈️</Text>}
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
    icon={<Text style={styles.emoji}>❤️</Text>}
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
    icon={<Text style={styles.emoji}>🔍</Text>}
    title="No Results Found"
    description="Try different keywords or clear your filters"
    actionLabel={onClearFilters ? 'Clear Filters' : undefined}
    onAction={onClearFilters}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  button: {
    minWidth: 200,
  },
});
