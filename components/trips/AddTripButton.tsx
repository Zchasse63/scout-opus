import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Plus, X, MapPin, Calendar } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface AddTripButtonProps {
  onTripCreated?: (trip: TripData) => void;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
}

export const AddTripButton: React.FC<AddTripButtonProps> = ({ onTripCreated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    setModalVisible(true);
    rotation.value = withTiming(90, { duration: 200 });
  };

  const handleClose = () => {
    setModalVisible(false);
    rotation.value = withTiming(0, { duration: 200 });
    resetForm();
  };

  const resetForm = () => {
    setDestination('');
    setStartDate('');
    setEndDate('');
  };

  const validateForm = (): boolean => {
    if (!destination.trim()) {
      Alert.alert('Required', 'Please enter a destination');
      return false;
    }

    if (!startDate || !endDate) {
      Alert.alert('Required', 'Please select start and end dates');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      Alert.alert('Invalid Dates', 'End date must be after start date');
      return false;
    }

    return true;
  };

  const handleCreateTrip = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in to create a trip.');
        return;
      }

      const tripData: TripData = {
        destination: destination.trim(),
        startDate,
        endDate,
      };

      // Insert trip into travel_periods table
      const { data: trip, error: insertError } = await supabase
        .from('travel_periods')
        .insert({
          user_id: user.id,
          destination: tripData.destination,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          source: 'manual', // User manually created this trip
          status: 'upcoming',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      onTripCreated?.(tripData);
      Alert.alert('Success', 'Trip created successfully! Now search for gyms at your destination.');
      handleClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, animatedStyle]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={styles.fabButton}
          activeOpacity={0.9}
        >
          <Plus color={colors.white} size={28} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Trip</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X color={colors.gray500} size={24} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.modalContent}>
            {/* Destination */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Destination</Text>
              <View style={styles.inputContainer}>
                <MapPin color={colors.gray400} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Where are you going?"
                  placeholderTextColor={colors.gray400}
                  value={destination}
                  onChangeText={setDestination}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Start Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Date</Text>
              <View style={styles.inputContainer}>
                <Calendar color={colors.gray400} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.gray400}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <Text style={styles.helper}>Format: YYYY-MM-DD (e.g., 2025-12-25)</Text>
            </View>

            {/* End Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>End Date</Text>
              <View style={styles.inputContainer}>
                <Calendar color={colors.gray400} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.gray400}
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
              <Text style={styles.helper}>Format: YYYY-MM-DD (e.g., 2025-12-30)</Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                After creating your trip, you can search for gyms at your destination and add them to your itinerary.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Create Trip"
              onPress={handleCreateTrip}
              loading={isLoading}
              style={styles.footerButton}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    zIndex: 1000,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  inputIcon: {
    marginLeft: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.black,
  },
  helper: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    marginTop: spacing.md,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    lineHeight: typography.lineHeights.base,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
