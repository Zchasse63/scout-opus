import React, { memo } from 'react';
import { Image, ImageProps, ImageContentFit } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  contentFit?: ImageContentFit;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

// Blurhash placeholder for loading state
const DEFAULT_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/**
 * Optimized image component using expo-image
 * - Automatic caching (memory + disk)
 * - Blurhash placeholder during load
 * - Lazy loading
 * - Memory efficient
 */
export const OptimizedImage = memo(function OptimizedImage({
  uri,
  width,
  height,
  aspectRatio,
  contentFit = 'cover',
  placeholder = DEFAULT_BLURHASH,
  containerStyle,
  style,
  ...props
}: OptimizedImageProps) {
  const imageStyle = [
    width && height ? { width, height } : undefined,
    aspectRatio ? { aspectRatio } : undefined,
    style,
  ];

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri }}
        style={imageStyle}
        contentFit={contentFit}
        placeholder={placeholder}
        placeholderContentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={uri}
        {...props}
      />
    </View>
  );
});

// Preset sizes for common use cases
export const GymCardImage = memo(function GymCardImage({
  uri,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'aspectRatio'>) {
  return (
    <OptimizedImage
      uri={uri}
      aspectRatio={16 / 9}
      style={styles.gymCard}
      {...props}
    />
  );
});

export const GymThumbnail = memo(function GymThumbnail({
  uri,
  size = 60,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      uri={uri}
      width={size}
      height={size}
      style={[styles.thumbnail, { width: size, height: size }]}
      {...props}
    />
  );
});

export const AvatarImage = memo(function AvatarImage({
  uri,
  size = 40,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      uri={uri}
      width={size}
      height={size}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  gymCard: {
    width: '100%',
    borderRadius: 12,
  },
  thumbnail: {
    borderRadius: 8,
  },
  avatar: {
    borderRadius: 20,
  },
});

