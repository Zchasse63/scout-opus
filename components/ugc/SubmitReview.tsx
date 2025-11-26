import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';

interface SubmitReviewProps {
  gymId: string;
  onReviewSubmitted?: () => void;
}

export const SubmitReview: React.FC<SubmitReviewProps> = ({
  gymId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    if (reviewText.trim().length < 20) {
      Alert.alert(
        'Review Too Short',
        'Please write at least 20 characters in your review.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit review to Supabase
      // 1. Create record in gym_reviews table
      // 2. Set moderation_status to 'pending'
      // 3. Award points to user
      // 4. Update gym's average rating

      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        'Success',
        'Your review has been submitted! You earned 20 points.',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setReviewText('');
              onReviewSubmitted?.();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Star
              color={star <= rating ? colors.warning : colors.gray300}
              fill={star <= rating ? colors.warning : 'transparent'}
              size={40}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      <Text style={styles.description}>
        Share your experience and help others. Earn 20 points!
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Your Rating</Text>
        {renderStars()}
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Share details about your experience at this gym..."
          placeholderTextColor={colors.gray400}
          multiline
          numberOfLines={6}
          value={reviewText}
          onChangeText={setReviewText}
          maxLength={500}
        />
        <Text style={styles.charCount}>
          {reviewText.length}/500 characters
        </Text>
      </View>

      <View style={styles.guidelines}>
        <Text style={styles.guidelinesTitle}>Review Guidelines:</Text>
        <Text style={styles.guidelineItem}>
          • Be honest and constructive
        </Text>
        <Text style={styles.guidelineItem}>
          • Focus on your experience, not opinions
        </Text>
        <Text style={styles.guidelineItem}>
          • No offensive language or personal attacks
        </Text>
        <Text style={styles.guidelineItem}>
          • Minimum 20 characters required
        </Text>
      </View>

      <Button
        title="Submit Review"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={rating === 0 || reviewText.trim().length < 20}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.gray600,
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeights.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  ratingText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.warning,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.black,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  guidelines: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  guidelinesTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  guidelineItem: {
    fontSize: typography.sizes.sm,
    color: colors.gray700,
    marginBottom: spacing.xxs,
  },
});
