import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { X, MapPin, Calendar, Trash2, Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

export default function EditTripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Mock data - would fetch from store/API
  const [city, setCity] = useState('Los Angeles');
  const [state, setState] = useState('California');
  const [country, setCountry] = useState('USA');
  const [startDate, setStartDate] = useState('2025-01-15');
  const [endDate, setEndDate] = useState('2025-01-20');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    if (!city.trim() || !startDate || !endDate) {
      haptics.error();
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    haptics.medium();
    setIsSubmitting(true);
    // TODO: Update trip via API/store
    setTimeout(() => {
      haptics.success();
      setIsSubmitting(false);
      router.back();
    }, 500);
  }, [city, startDate, endDate, router]);

  const handleDelete = useCallback(() => {
    haptics.warning();
    Alert.alert('Delete Trip', 'Are you sure you want to delete this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        haptics.medium();
        // TODO: Delete via API/store
        router.back();
      }},
    ]);
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={iconSizes.lg} color={colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Trip</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSubmitting}>
              <Check size={iconSizes.lg} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Destination</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <MapPin size={iconSizes.md} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="City *" placeholderTextColor={colors.gray400} value={city} onChangeText={setCity} />
              </View>
              <View style={styles.inputRow}>
                <View style={{ width: iconSizes.md }} />
                <TextInput style={styles.input} placeholder="State/Province" placeholderTextColor={colors.gray400} value={state} onChangeText={setState} />
              </View>
              <View style={styles.inputRow}>
                <View style={{ width: iconSizes.md }} />
                <TextInput style={styles.input} placeholder="Country" placeholderTextColor={colors.gray400} value={country} onChangeText={setCountry} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dates</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Calendar size={iconSizes.md} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="Start Date (YYYY-MM-DD) *" placeholderTextColor={colors.gray400} value={startDate} onChangeText={setStartDate} />
              </View>
              <View style={styles.inputRow}>
                <View style={{ width: iconSizes.md }} />
                <TextInput style={styles.input} placeholder="End Date (YYYY-MM-DD) *" placeholderTextColor={colors.gray400} value={endDate} onChangeText={setEndDate} />
              </View>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={iconSizes.md} color={colors.error} />
              <Text style={styles.deleteButtonText}>Delete Trip</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  closeButton: { padding: spacing.sm },
  saveButton: { padding: spacing.sm },
  title: { ...typography.h3, color: colors.black },
  content: { flex: 1, paddingHorizontal: padding.screenHorizontal, paddingTop: spacing.lg },
  sectionTitle: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.lg },
  inputGroup: { backgroundColor: colors.gray50, borderRadius: radius.lg, overflow: 'hidden' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  input: { flex: 1, ...typography.body, color: colors.black, marginLeft: spacing.sm },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xxl, paddingVertical: spacing.md, backgroundColor: colors.errorLight, borderRadius: radius.md },
  deleteButtonText: { ...typography.bodyBold, color: colors.error },
});

