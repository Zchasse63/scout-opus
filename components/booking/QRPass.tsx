import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Download } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Badge } from '../ui/Badge';

interface QRPassProps {
  bookingId: string;
  gymName: string;
  passType: string;
  bookingDate: string;
  qrCodeData: string;
  status: 'confirmed' | 'used' | 'cancelled';
  onAddToWallet?: () => void;
}

export const QRPass: React.FC<QRPassProps> = ({
  bookingId,
  gymName,
  passType,
  bookingDate,
  qrCodeData,
  status,
  onAddToWallet,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return <Badge label="Active" variant="success" />;
      case 'used':
        return <Badge label="Used" variant="neutral" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.gymName}>{gymName}</Text>
          <Text style={styles.passType}>{passType.toUpperCase()} PASS</Text>
        </View>
        {getStatusBadge()}
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={qrCodeData}
          size={200}
          backgroundColor={colors.white}
          color={colors.black}
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking ID</Text>
          <Text style={styles.detailValue}>#{bookingId.slice(0, 8)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{new Date(bookingDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Add to Wallet button */}
      {status === 'confirmed' && onAddToWallet && (
        <TouchableOpacity style={styles.walletButton} onPress={onAddToWallet}>
          <Download color={colors.primary} size={20} />
          <Text style={styles.walletButtonText}>Add to Apple Wallet</Text>
        </TouchableOpacity>
      )}

      {/* Instructions */}
      <Text style={styles.instructions}>
        Show this QR code at the gym entrance for check-in
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  gymName: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  passType: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 1,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray100,
  },
  details: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.sizes.base,
    color: colors.gray500,
  },
  detailValue: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  walletButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  instructions: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
});
