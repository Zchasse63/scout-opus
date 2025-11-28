/**
 * FullScreenGallery - Full-screen photo gallery with pinch-zoom and swipe
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Dimensions, Image, SafeAreaView,
} from 'react-native';
import { X, Grid, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FullScreenGalleryProps {
  visible: boolean;
  photos: string[];
  initialIndex?: number;
  onClose: () => void;
  categories?: { name: string; photos: string[] }[];
}

export function FullScreenGallery({
  visible,
  photos,
  initialIndex = 0,
  onClose,
  categories,
}: FullScreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showGrid, setShowGrid] = useState(false);

  const handleScroll = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
    setShowGrid(false);
  }, []);

  const renderPhoto = useCallback(({ item }: { item: string }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} resizeMode="contain" />
    </View>
  ), []);

  const renderGridItem = useCallback(({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => {
        haptics.selection();
        goToPhoto(index);
      }}
    >
      <Image source={{ uri: item }} style={styles.gridImage} />
    </TouchableOpacity>
  ), [goToPhoto]);

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={iconSizes.lg} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1} / {photos.length}
          </Text>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => {
              haptics.light();
              setShowGrid(!showGrid);
            }}
          >
            <Grid size={iconSizes.lg} color={colors.white} />
          </TouchableOpacity>
        </View>

        {showGrid ? (
          /* Grid View */
          <FlatList
            data={photos}
            renderItem={renderGridItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
          />
        ) : (
          /* Swipe View */
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />
        )}

        {/* Category tabs if provided */}
        {categories && categories.length > 0 && !showGrid && (
          <View style={styles.categoryTabs}>
            {categories.map((cat, index) => (
              <TouchableOpacity key={index} style={styles.categoryTab}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.screenHorizontal,
    paddingVertical: spacing.md,
  },
  closeButton: { padding: spacing.sm },
  counter: { ...typography.body, color: colors.white },
  gridButton: { padding: spacing.sm },
  photoContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 150, justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  gridContent: { padding: spacing.xxs },
  gridItem: { width: (SCREEN_WIDTH - spacing.xxs * 4) / 3, height: (SCREEN_WIDTH - spacing.xxs * 4) / 3, margin: spacing.xxs },
  gridImage: { width: '100%', height: '100%', borderRadius: radius.sm },
  categoryTabs: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.md },
  categoryTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.full },
  categoryText: { ...typography.small, color: colors.white },
});

export default FullScreenGallery;

