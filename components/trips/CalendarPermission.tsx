import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CalendarPermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const CalendarPermission: React.FC<CalendarPermissionProps> = ({
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        onPermissionGranted?.();
      }
    } catch (error) {
      console.error('Error checking calendar permission:', error);
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        Alert.alert(
          'Calendar Sync Enabled',
          'Scout can now detect your travel plans and suggest gyms at your destinations.',
          [{ text: 'Got it', style: 'default' }]
        );
        onPermissionGranted?.();
      } else {
        Alert.alert(
          'Permission Denied',
          'Calendar access is required for travel detection. You can enable it later in Settings.',
          [{ text: 'OK', style: 'default' }]
        );
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error requesting calendar permission:', error);
      Alert.alert('Error', 'Failed to request calendar permission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (permissionStatus === 'granted') {
    return (
      <Card style={styles.container} pressable={false}>
        <View style={styles.iconContainer}>
          <CalendarIcon color={colors.success} size={32} />
        </View>
        <Text style={styles.title}>Calendar Sync Active</Text>
        <Text style={styles.description}>
          We'll automatically detect your travel plans and suggest gyms at your destinations.
        </Text>
      </Card>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <Card style={styles.container} pressable={false}>
        <View style={styles.iconContainer}>
          <AlertCircle color={colors.warning} size={32} />
        </View>
        <Text style={styles.title}>Calendar Access Denied</Text>
        <Text style={styles.description}>
          Enable calendar access in Settings to unlock travel detection and automatic trip planning.
        </Text>
        <Button
          title="Open Settings"
          onPress={openSettings}
          variant="outline"
          style={styles.button}
        />
      </Card>
    );
  }

  return (
    <Card style={styles.container} pressable={false}>
      <View style={styles.iconContainer}>
        <CalendarIcon color={colors.primary} size={32} />
      </View>
      <Text style={styles.title}>Enable Travel Detection</Text>
      <Text style={styles.description}>
        Connect your calendar to automatically discover upcoming trips and find the best gyms at your destinations.
      </Text>

      <View style={styles.benefits}>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✈️</Text>
          <Text style={styles.benefitText}>Auto-detect travel plans</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🏋️</Text>
          <Text style={styles.benefitText}>Discover gyms at destinations</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>📱</Text>
          <Text style={styles.benefitText}>Get pre-trip reminders</Text>
        </View>
      </View>

      <Button
        title="Enable Calendar Sync"
        onPress={requestPermission}
        loading={isLoading}
        style={styles.button}
      />

      <Text style={styles.privacy}>
        Your calendar data stays private and is only used for travel detection. We never share your information.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.lg,
  },
  benefits: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  benefitIcon: {
    fontSize: typography.sizes.xl,
    marginRight: spacing.md,
  },
  benefitText: {
    fontSize: typography.sizes.base,
    color: colors.gray700,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    marginBottom: spacing.md,
  },
  privacy: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: typography.lineHeights.base,
  },
});
