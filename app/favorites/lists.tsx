/**
 * Wishlist Management - Create and manage multiple lists
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Folder, MoreVertical, Edit2, Trash2, X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface WishList {
  id: string;
  name: string;
  count: number;
  coverImage?: string;
}

export default function WishlistsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<WishList[]>([
    { id: 'default', name: 'All Saved', count: 12 },
    { id: '1', name: 'NYC Trip', count: 5 },
    { id: '2', name: 'Home Gyms', count: 3 },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    haptics.success();
    setLists(prev => [...prev, { id: Date.now().toString(), name: newListName.trim(), count: 0 }]);
    setNewListName('');
    setShowCreateModal(false);
  };

  const handleDeleteList = (id: string) => {
    if (id === 'default') return;
    Alert.alert('Delete List', 'Are you sure? Gyms will remain in All Saved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        haptics.medium();
        setLists(prev => prev.filter(l => l.id !== id));
      }},
    ]);
  };

  const renderList = ({ item }: { item: WishList }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => { haptics.light(); router.push('/favorites'); }}
    >
      <View style={styles.listIcon}>
        <Folder size={iconSizes.lg} color={colors.primary} />
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.listCount}>{item.count} gyms</Text>
      </View>
      {item.id !== 'default' && (
        <TouchableOpacity onPress={() => handleDeleteList(item.id)} style={styles.moreButton}>
          <Trash2 size={iconSizes.sm} color={colors.gray400} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={iconSizes.lg} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>My Lists</Text>
        <TouchableOpacity onPress={() => { haptics.light(); setShowCreateModal(true); }} style={styles.addButton}>
          <Plus size={iconSizes.md} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Create List Modal */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New List</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={iconSizes.md} color={colors.gray600} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newListName}
              onChangeText={setNewListName}
              placeholder="List name"
              placeholderTextColor={colors.gray400}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.createButton, !newListName.trim() && styles.createButtonDisabled]}
              onPress={handleCreateList}
              disabled={!newListName.trim()}
            >
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  backButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  addButton: { padding: spacing.xs },
  listContent: { padding: padding.screenHorizontal, paddingTop: spacing.lg },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md },
  listIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  listInfo: { flex: 1 },
  listName: { ...typography.bodyBold, color: colors.black },
  listCount: { ...typography.small, color: colors.gray500, marginTop: spacing.xxs },
  moreButton: { padding: spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, width: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h4, color: colors.black },
  input: { backgroundColor: colors.gray50, borderRadius: radius.lg, padding: spacing.lg, ...typography.body, color: colors.black, marginBottom: spacing.lg },
  createButton: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center' },
  createButtonDisabled: { backgroundColor: colors.gray300 },
  createButtonText: { ...typography.bodyBold, color: colors.white },
});

