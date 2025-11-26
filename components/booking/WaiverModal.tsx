import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';

interface WaiverModalProps {
  visible: boolean;
  gymName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const WaiverModal: React.FC<WaiverModalProps> = ({
  visible,
  gymName,
  onAccept,
  onDecline,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDecline}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Liability Waiver</Text>
          <TouchableOpacity onPress={onDecline} style={styles.closeButton}>
            <X color={colors.gray500} size={24} />
          </TouchableOpacity>
        </View>

        {/* Waiver content */}
        <ScrollView
          style={styles.content}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={styles.gymName}>{gymName}</Text>

          <Text style={styles.sectionTitle}>Assumption of Risk</Text>
          <Text style={styles.paragraph}>
            I acknowledge that participation in fitness activities involves inherent risks, including but not limited to: physical injury, property damage, and in extreme cases, permanent disability or death.
          </Text>

          <Text style={styles.sectionTitle}>Release of Liability</Text>
          <Text style={styles.paragraph}>
            I hereby release, waive, discharge, and covenant not to sue {gymName}, Scout Fitness, and their respective owners, employees, agents, and representatives from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by me while using the facility or participating in any activities.
          </Text>

          <Text style={styles.sectionTitle}>Medical Clearance</Text>
          <Text style={styles.paragraph}>
            I certify that I am physically fit and have no medical condition that would prevent my full participation in fitness activities. I acknowledge that it is my responsibility to consult with a physician prior to and regarding my participation in any fitness activity.
          </Text>

          <Text style={styles.sectionTitle}>Rules and Conduct</Text>
          <Text style={styles.paragraph}>
            I agree to observe and obey all facility rules and regulations, and further agree to follow the instructions and directions of facility staff. I understand that I may be asked to leave the premises for failure to comply with rules and regulations.
          </Text>

          <Text style={styles.sectionTitle}>Photo and Video Release</Text>
          <Text style={styles.paragraph}>
            I grant permission to {gymName} to use photographs, video, or other media of me for promotional purposes without compensation.
          </Text>

          <Text style={styles.sectionTitle}>Agreement</Text>
          <Text style={styles.paragraph}>
            By accepting this waiver, I acknowledge that I have read and voluntarily agree to the terms and conditions stated above. I understand that this waiver is legally binding and will affect my legal rights.
          </Text>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!hasScrolledToBottom && (
            <Text style={styles.scrollPrompt}>
              Please scroll to the bottom to continue
            </Text>
          )}
          <View style={styles.buttonRow}>
            <Button
              title="Decline"
              onPress={onDecline}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Accept"
              onPress={onAccept}
              disabled={!hasScrolledToBottom}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  gymName: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: typography.sizes.base,
    color: colors.gray700,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.md,
  },
  spacer: {
    height: spacing.xl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  scrollPrompt: {
    fontSize: typography.sizes.sm,
    color: colors.warning,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
