import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SectionList,
  Modal,
  Pressable,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, MapPin, Clock, Navigation, QrCode, Wallet, ChevronRight, CheckCircle, XCircle, Timer } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { Booking } from '../../types';
import { useBookings } from '../../hooks/useBookings';
import { QRPass } from '../../components/booking/QRPass';
import { haptics } from '../../utils/haptics';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

interface BookingSection {
  title: string;
  data: Booking[];
}

export default function PassesTab() {
  const { data: bookings, isLoading, error } = useBookings();
  const today = new Date().toISOString().split('T')[0];
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // All hooks must be called before any early returns
  const handleShowQR = useCallback((booking: Booking) => {
    haptics.medium();
    setSelectedBooking(booking);
    setQrModalVisible(true);
  }, []);

  const handleCloseQR = useCallback(() => {
    setQrModalVisible(false);
    setSelectedBooking(null);
  }, []);

  const handleAddToWallet = useCallback((booking: Booking) => {
    haptics.light();
    // TODO: Implement Apple Wallet integration
    console.log('Add to wallet:', booking.id);
  }, []);

  const handleGetDirections = useCallback((booking: Booking) => {
    haptics.light();
    // Open maps with gym address
    const address = encodeURIComponent(booking.gymName || 'Gym');
    const url = Platform.select({
      ios: `maps:?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });
    if (url) Linking.openURL(url);
  }, []);

  // Categorize bookings (useMemo ensures consistent hook count)
  const sections = useMemo(() => {
    if (!bookings) return [];

    const activeBookings = bookings.filter(
      (b) => b.bookingDate === today && b.status !== 'cancelled'
    );
    const upcomingBookings = bookings.filter(
      (b) => b.bookingDate > today && b.status !== 'cancelled'
    );
    const pastBookings = bookings.filter((b) => b.bookingDate < today);

    return [
      { title: 'Active Today', data: activeBookings },
      { title: 'Upcoming', data: upcomingBookings },
      { title: 'Past', data: pastBookings },
    ].filter((s) => s.data.length > 0) as BookingSection[];
  }, [bookings, today]);

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My Passes</Text>
        </View>
        <View style={styles.listContent}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardWithImage}>
                <Skeleton width={80} height={80} borderRadius={radius.md} />
                <View style={styles.cardContent}>
                  <Skeleton width={150} height={20} />
                  <Skeleton width={200} height={16} style={{ marginTop: spacing.xs }} />
                  <Skeleton width={100} height={14} style={{ marginTop: spacing.xs }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My Passes</Text>
        </View>
        <EmptyState
          icon="alert-circle"
          title="Failed to load passes"
          description={error.message}
          actionLabel="Try Again"
          onAction={() => {}}
        />
      </SafeAreaView>
    );
  }

  // Generate QR code data for a booking
  const generateQRData = (booking: Booking): string => {
    // Create a JSON payload with booking info
    const qrPayload = {
      bookingId: booking.id,
      userId: booking.userId,
      gymId: booking.gymId,
      date: booking.bookingDate,
      type: booking.passType,
      // Add a simple signature (in production, use HMAC)
      sig: btoa(`${booking.id}:${booking.bookingDate}`).slice(0, 16),
    };
    return JSON.stringify(qrPayload);
  };

  const renderBookingCard = ({ item: booking }: { item: Booking }) => (
    <EnhancedBookingCard
      booking={booking}
      onShowQR={() => handleShowQR(booking)}
      onAddToWallet={() => handleAddToWallet(booking)}
      onGetDirections={() => handleGetDirections(booking)}
    />
  );

  const renderSectionHeader = ({ section }: { section: BookingSection }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="ticket"
      title="No Passes Yet"
      description="Book a gym pass to get started on your fitness journey"
      actionLabel="Find a Gym"
      onAction={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Passes</Text>
      </View>

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingCard}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmpty()
      )}

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseQR}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Pass</Text>
            <Pressable onPress={handleCloseQR} style={styles.closeButton}>
              <X color={colors.gray500} size={24} />
            </Pressable>
          </View>

          {selectedBooking && (
            <View style={styles.qrContent}>
              <QRPass
                bookingId={selectedBooking.id}
                gymName={selectedBooking.gymName || 'Gym'}
                passType={selectedBooking.passType}
                bookingDate={selectedBooking.bookingDate}
                qrCodeData={generateQRData(selectedBooking)}
                status={selectedBooking.status as 'confirmed' | 'used' | 'cancelled'}
                onAddToWallet={() => handleAddToWallet(selectedBooking)}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

interface EnhancedBookingCardProps {
  booking: Booking;
  onShowQR: () => void;
  onAddToWallet: () => void;
  onGetDirections: () => void;
}

function EnhancedBookingCard({ booking, onShowQR, onAddToWallet, onGetDirections }: EnhancedBookingCardProps) {
  const getPassTypeLabel = (type: string) => {
    switch (type) {
      case 'day': return 'Day Pass';
      case 'week': return 'Week Pass';
      case 'month': return 'Month Pass';
      default: return 'Pass';
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed': return { color: colors.success, icon: CheckCircle, label: 'Confirmed' };
      case 'used': return { color: colors.gray500, icon: CheckCircle, label: 'Used' };
      case 'cancelled': return { color: colors.error, icon: XCircle, label: 'Cancelled' };
      default: return { color: colors.gray600, icon: Timer, label: status };
    }
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Expired';
    return `In ${diffDays} days`;
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  // Mock gym data - in real app would come from booking
  const gymImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200';
  const gymAddress = '123 Main St, Los Angeles, CA';
  const gymHours = 'Open 5 AM - 11 PM';

  return (
    <TouchableOpacity style={styles.card} onPress={onShowQR} activeOpacity={0.7}>
      <View style={styles.cardWithImage}>
        <Image source={{ uri: gymImage }} style={styles.gymImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{booking.gymName || 'Gym'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
              <StatusIcon size={iconSizes.xs} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
          </View>

          <Text style={styles.passType}>{getPassTypeLabel(booking.passType)}</Text>

          <View style={styles.infoRow}>
            <MapPin size={iconSizes.xs} color={colors.gray500} />
            <Text style={styles.infoText} numberOfLines={1}>{gymAddress}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={iconSizes.xs} color={colors.gray500} />
            <Text style={styles.infoText}>{gymHours}</Text>
          </View>

          {booking.status === 'confirmed' && (
            <View style={styles.countdownBadge}>
              <Timer size={iconSizes.xs} color={colors.primary} />
              <Text style={styles.countdownText}>{getDaysUntilExpiry()}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); onShowQR(); }}>
          <QrCode size={iconSizes.sm} color={colors.white} />
          <Text style={styles.actionButtonText}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={(e) => { e.stopPropagation(); onGetDirections(); }}>
          <Navigation size={iconSizes.sm} color={colors.primary} />
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Directions</Text>
        </TouchableOpacity>

        {booking.status === 'confirmed' && (
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={(e) => { e.stopPropagation(); onAddToWallet(); }}>
            <Wallet size={iconSizes.sm} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Wallet</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  title: { ...typography.h2, color: colors.black },
  listContent: { paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg },
  sectionHeader: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, marginBottom: spacing.md, overflow: 'hidden', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardWithImage: { flexDirection: 'row', padding: spacing.md },
  gymImage: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.gray200 },
  cardContent: { flex: 1, marginLeft: spacing.md },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xxs },
  cardTitle: { ...typography.bodyBold, color: colors.black, flex: 1, marginRight: spacing.sm },
  passType: { ...typography.small, color: colors.primary, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xxs },
  infoText: { ...typography.small, color: colors.gray600, flex: 1 },
  countdownBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.full, alignSelf: 'flex-start', marginTop: spacing.xs },
  countdownText: { ...typography.tinyBold, color: colors.primary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.full },
  statusText: { ...typography.tinyBold },
  cardDivider: { height: 1, backgroundColor: colors.gray100 },
  cardActions: { flexDirection: 'row', padding: spacing.sm, gap: spacing.sm },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.md },
  actionButtonSecondary: { backgroundColor: colors.gray100 },
  actionButtonText: { ...typography.smallBold, color: colors.white },
  actionButtonTextSecondary: { color: colors.primary },
  modalContainer: { flex: 1, backgroundColor: colors.gray50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  modalTitle: { ...typography.h3, color: colors.black },
  closeButton: { padding: spacing.sm },
  qrContent: { flex: 1, padding: padding.screenHorizontal, justifyContent: 'center' },
});
