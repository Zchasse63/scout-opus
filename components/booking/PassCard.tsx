import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Badge } from '../ui/Badge';

interface PassCardProps {
  bookingId: string;
  gymName: string;
  gymAddress: string;
  passType: string;
  bookingDate: string;
  status: 'confirmed' | 'used' | 'cancelled';
  amountPaid: number;
}

export const PassCard: React.FC<PassCardProps> = ({
  bookingId,
  gymName,
  gymAddress,
  passType,
  bookingDate,
  status,
  amountPaid,
}) => {
  const router = useRouter();

  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return <Badge label="Active" variant="success" size="small" />;
      case 'used':
        return <Badge label="Used" variant="neutral" size="small" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" size="small" />;
    }
  };

  const handlePress = () => {
    router.push(`/booking/${bookingId}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.gymName}>{gymName}</Text>
          <Text style={styles.address}>{gymAddress}</Text>
        </View>
        {getStatusBadge()}
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pass Type</Text>
          <Text style={styles.detailValue}>{passType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(bookingDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>${amountPaid.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.viewDetails}>View Pass</Text>
        <ChevronRight color={colors.primary} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  gymName: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
    marginBottom: spacing.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    marginBottom: spacing.xxs,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewDetails: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primary,
  },
});
