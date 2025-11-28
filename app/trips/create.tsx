import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { X, MapPin, Calendar, Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { padding, spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

export default function CreateTripScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
  }, [router]);

  const handleCreate = useCallback(async () => {
    if (!city.trim() || !startDate || !endDate) {
      haptics.error();
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    haptics.medium();
    setIsSubmitting(true);
    // TODO: Save trip via API/store
    setTimeout(() => {
      haptics.success();
      setIsSubmitting(false);
      router.back();
    }, 500);
  }, [city, startDate, endDate, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={iconSizes.lg} color={colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Trip</Text>
            <TouchableOpacity style={[styles.saveButton, (!city || !startDate || !endDate) && styles.saveButtonDisabled]} onPress={handleCreate} disabled={isSubmitting || !city || !startDate || !endDate}>
              <Check size={iconSizes.lg} color={(!city || !startDate || !endDate) ? colors.gray400 : colors.primary} />
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

            <Text style={styles.hint}>Tip: We'll automatically find gyms in this area during your trip dates.</Text>
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
  saveButtonDisabled: { opacity: 0.5 },
  title: { ...typography.h3, color: colors.black },
  content: { flex: 1, paddingHorizontal: padding.screenHorizontal, paddingTop: spacing.lg },
  sectionTitle: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.lg },
  inputGroup: { backgroundColor: colors.gray50, borderRadius: radius.lg, overflow: 'hidden' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  input: { flex: 1, ...typography.body, color: colors.black, marginLeft: spacing.sm },
  hint: { ...typography.small, color: colors.gray500, marginTop: spacing.xl, textAlign: 'center', paddingHorizontal: spacing.lg },
});

