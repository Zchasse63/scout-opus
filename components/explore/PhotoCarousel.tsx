/**
 * PhotoCarousel - Swipeable photo carousel with pagination dots
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, ViewToken,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { Skeleton } from '../ui/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PhotoCarouselProps {
  photos: string[];
  height?: number;
  width?: number;
  borderRadius?: number;
  showPagination?: boolean;
  onPhotoPress?: (index: number) => void;
}

export function PhotoCarousel({
  photos,
  height = 200,
  width = SCREEN_WIDTH - spacing.lg * 2,
  borderRadius = radius.lg,
  showPagination = true,
  onPhotoPress,
}: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const renderPhoto = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      const isLoaded = loadedImages.has(index);

      return (
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => onPhotoPress?.(index)}
          style={[styles.photoContainer, { width, height }]}
        >
          {!isLoaded && (
            <View style={[styles.skeleton, { width, height }]}>
              <Skeleton width={width} height={height} borderRadius={0} />
            </View>
          )}
          <Animated.Image
            source={{ uri: item }}
            style={[styles.photo, { width, height }, !isLoaded && styles.hidden]}
            resizeMode="cover"
            onLoad={() => handleImageLoad(index)}
            entering={FadeIn.duration(200)}
          />
        </TouchableOpacity>
      );
    },
    [width, height, loadedImages, onPhotoPress, handleImageLoad]
  );

  if (photos.length === 0) {
    return (
      <View style={[styles.container, { width, height, borderRadius }]}>
        <Skeleton width={width} height={height} borderRadius={borderRadius} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderRadius }]}>
      <FlatList
        ref={flatListRef}
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />

      {/* Pagination dots */}
      {showPagination && photos.length > 1 && (
        <View style={styles.pagination}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', position: 'relative' },
  photoContainer: { position: 'relative' },
  photo: { backgroundColor: colors.gray200 },
  hidden: { opacity: 0 },
  skeleton: { position: 'absolute', top: 0, left: 0 },
  pagination: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: { backgroundColor: colors.white, width: 8, height: 8, borderRadius: 4 },
});

export default PhotoCarousel;

