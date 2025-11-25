import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface ViewToggleFABProps {
  viewMode: 'list' | 'map';
  onToggle: () => void;
}

export default function ViewToggleFAB({ viewMode, onToggle }: ViewToggleFABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>
        {viewMode === 'list' ? '🗺️' : '📋'}
      </Text>
      <Text style={styles.label}>
        {viewMode === 'list' ? 'Map' : 'List'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    ...typography.caption,
    color: colors.white,
    marginTop: 2,
  },
});
