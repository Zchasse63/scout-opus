import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Button } from '../ui/Button';

interface SubmitPhotoProps {
  gymId: string;
  onPhotoSubmitted?: (photoUrl: string) => void;
}

export const SubmitPhoto: React.FC<SubmitPhotoProps> = ({
  gymId,
  onPhotoSubmitted,
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload photos.'
      );
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages([...selectedImages, ...newImages].slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow camera access to take photos.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImages([...selectedImages, result.assets[0].uri].slice(0, 5));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Photos', 'Please select at least one photo to upload.');
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Upload images to Supabase Storage
      // For each image:
      // 1. Upload to storage bucket
      // 2. Create record in gym_photos table with moderation status 'pending'
      // 3. Award points to user for contribution

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Your photos have been submitted for review. You earned 20 points!',
        [{ text: 'OK', onPress: () => setSelectedImages([]) }]
      );

      onPhotoSubmitted?.(selectedImages[0]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      Alert.alert('Error', 'Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos</Text>
      <Text style={styles.description}>
        Help others by sharing photos of this gym. Earn 20 points for each approved photo!
      </Text>

      {selectedImages.length > 0 && (
        <View style={styles.imageGrid}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <X color={colors.white} size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Take Photo"
          onPress={takePhoto}
          variant="outline"
          icon={<Camera color={colors.primary} size={20} />}
          style={styles.actionButton}
        />
        <Button
          title="Choose Photos"
          onPress={pickImages}
          variant="outline"
          style={styles.actionButton}
        />
      </View>

      {selectedImages.length > 0 && (
        <Button
          title={isUploading ? 'Uploading...' : `Upload ${selectedImages.length} Photo${selectedImages.length > 1 ? 's' : ''}`}
          onPress={uploadPhotos}
          loading={isUploading}
          style={styles.uploadButton}
        />
      )}

      <Text style={styles.note}>
        Photos will be reviewed before appearing on the gym page.
      </Text>
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
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeights.lg,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error + 'CC',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  uploadButton: {
    marginBottom: spacing.md,
  },
  note: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    textAlign: 'center',
  },
});
