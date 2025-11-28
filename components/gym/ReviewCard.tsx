/**
 * ReviewCard - Individual review display component
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import type { Review } from '../../hooks/useGymReviews';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: review.userAvatar || 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{review.userName}</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={iconSizes.sm}
                color={star <= review.rating ? colors.warning : colors.gray300}
                fill={star <= review.rating ? colors.warning : 'transparent'}
              />
            ))}
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {review.title && <Text style={styles.title}>{review.title}</Text>}
      <Text style={styles.content}>{review.content}</Text>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <View style={styles.photosRow}>
          {review.photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
          ))}
        </View>
      )}

      {/* Owner Response */}
      {review.ownerResponse && (
        <View style={styles.ownerResponse}>
          <View style={styles.ownerHeader}>
            <MessageCircle size={iconSizes.sm} color={colors.primary} />
            <Text style={styles.ownerLabel}>Response from owner</Text>
          </View>
          <Text style={styles.ownerContent}>{review.ownerResponse.content}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.helpfulButton}
          onPress={() => {
            haptics.light();
            onHelpful?.(review.id);
          }}
        >
          <ThumbsUp size={iconSizes.sm} color={colors.gray600} />
          <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  header: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray200 },
  headerInfo: { flex: 1, gap: spacing.xxs },
  userName: { ...typography.bodyBold, color: colors.black },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  date: { ...typography.small, color: colors.gray500, marginLeft: spacing.sm },
  title: { ...typography.bodyBold, color: colors.black, marginBottom: spacing.xs },
  content: { ...typography.body, color: colors.gray700, lineHeight: 22 },
  photosRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  reviewPhoto: { width: 80, height: 80, borderRadius: radius.sm, backgroundColor: colors.gray200 },
  ownerResponse: { backgroundColor: colors.gray100, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.md },
  ownerHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  ownerLabel: { ...typography.smallBold, color: colors.primary },
  ownerContent: { ...typography.small, color: colors.gray700, lineHeight: 20 },
  actions: { flexDirection: 'row', marginTop: spacing.md },
  helpfulButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  helpfulText: { ...typography.small, color: colors.gray600 },
});

export default ReviewCard;

