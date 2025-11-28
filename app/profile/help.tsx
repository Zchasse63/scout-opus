/**
 * Help & Support Screen - FAQ, contact options
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, MessageCircle, Mail, Phone, FileText, ExternalLink, HelpCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  { question: 'How do I book a gym pass?', answer: 'Browse gyms, select one you like, choose your pass type and dates, then complete payment. Your pass will be available in the Passes tab.' },
  { question: 'Can I cancel my booking?', answer: 'Yes, you can cancel up to 24 hours before your visit for a full refund. Check the specific gym\'s cancellation policy for details.' },
  { question: 'How do I check in at the gym?', answer: 'Show the QR code from your pass to the gym staff. The code is available in the Passes tab of the app.' },
  { question: 'What if the gym is closed?', answer: 'If a gym is unexpectedly closed, contact our support and we\'ll help you get a refund or rebook at another location.' },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const contactOptions = [
    { id: 'chat', label: 'Live Chat', subtitle: 'Usually responds in minutes', icon: MessageCircle, onPress: () => {} },
    { id: 'email', label: 'Email Support', subtitle: 'support@scoutfitness.com', icon: Mail, onPress: () => Linking.openURL('mailto:support@scoutfitness.com') },
    { id: 'phone', label: 'Call Us', subtitle: '+1 (800) 555-0123', icon: Phone, onPress: () => Linking.openURL('tel:+18005550123') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.card}>
          {contactOptions.map((option, index) => (
            <TouchableOpacity key={option.id} style={[styles.contactRow, index < contactOptions.length - 1 && styles.rowBorder]} onPress={() => { haptics.light(); option.onPress(); }}>
              <View style={styles.iconContainer}><option.icon size={iconSizes.md} color={colors.primary} /></View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{option.label}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <ChevronRight size={iconSizes.sm} color={colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {faqs.map((faq, index) => (
            <TouchableOpacity key={index} style={[styles.faqItem, index < faqs.length - 1 && styles.rowBorder]} onPress={() => { haptics.light(); setExpandedFaq(expandedFaq === index ? null : index); }}>
              <View style={styles.faqHeader}>
                <HelpCircle size={iconSizes.sm} color={colors.gray500} />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal Links */}
        <View style={styles.legalLinks}>
          <TouchableOpacity style={styles.legalLink}><FileText size={iconSizes.sm} color={colors.gray500} /><Text style={styles.legalText}>Terms of Service</Text><ExternalLink size={iconSizes.xs} color={colors.gray400} /></TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}><FileText size={iconSizes.sm} color={colors.gray500} /><Text style={styles.legalText}>Privacy Policy</Text><ExternalLink size={iconSizes.xs} color={colors.gray400} /></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  content: { flex: 1, padding: padding.screenHorizontal },
  sectionTitle: { ...typography.small, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  contactInfo: { flex: 1 },
  contactLabel: { ...typography.bodyBold, color: colors.black },
  contactSubtitle: { ...typography.small, color: colors.gray500 },
  faqItem: { padding: spacing.lg },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faqQuestion: { ...typography.bodyBold, color: colors.black, flex: 1 },
  faqAnswer: { ...typography.body, color: colors.gray600, marginTop: spacing.sm, marginLeft: spacing.xl },
  legalLinks: { marginTop: spacing.xl, marginBottom: spacing.xxxl },
  legalLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  legalText: { ...typography.body, color: colors.gray600, flex: 1 },
});

