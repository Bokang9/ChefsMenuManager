import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { initialMenuItems, courseOptions } from './src/data/menuData';
import StatCard from './src/components/StatCard';
import MenuItemCard from './src/components/MenuItemCard';
import MenuFormModal from './src/components/MenuFormModal';
import { formatCurrency } from './src/utils/currency';

export default function App() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    course: 'Starter',
    price: '',
  });

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        searchText.trim() === '';

      const courseMatch =
        selectedCourse === 'All' || item.course === selectedCourse;

      return searchMatch && courseMatch;
    });
  }, [menuItems, searchText, selectedCourse]);

  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const totalPrice = menuItems.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;

    const starterCount = menuItems.filter(
      (item) => item.course === 'Starter'
    ).length;
    const mainCount = menuItems.filter(
      (item) => item.course === 'Main Course'
    ).length;
    const dessertCount = menuItems.filter(
      (item) => item.course === 'Dessert'
    ).length;

    return {
      totalItems,
      averagePrice,
      starterCount,
      mainCount,
      dessertCount,
    };
  }, [menuItems]);

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      course: 'Starter',
      price: '',
    });
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      course: item.course,
      price: String(item.price),
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSave = () => {
    const trimmedName = formData.name.trim();
    const parsedPrice = Number(formData.price);

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Please enter a menu item name.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    if (editingItem) {
      setMenuItems((current) =>
        current.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: trimmedName,
                course: formData.course,
                price: parsedPrice,
              }
            : item
        )
      );
      Alert.alert('Success', 'Menu item updated successfully.');
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: trimmedName,
        course: formData.course,
        price: parsedPrice,
      };

      setMenuItems((current) => [newItem, ...current]);
      Alert.alert('Success', 'Menu item added successfully.');
    }

    closeModal();
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((current) =>
              current.filter((item) => item.id !== id)
            );
            Alert.alert('Success', 'Menu item deleted successfully.');
          },
        },
      ]
    );
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCourse('All');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Chef's Menu Manager</Text>
          <Text style={styles.subtitle}>Manage your kitchen menu with ease</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Total Items" value={stats.totalItems} />
          <StatCard label="Avg Price" value={formatCurrency(stats.averagePrice)} />
          <StatCard label="Starters" value={stats.starterCount} />
          <StatCard label="Main Courses" value={stats.mainCount} />
          <StatCard label="Desserts" value={stats.dessertCount} />
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu item by name"
            value={searchText}
            onChangeText={setSearchText}
          />

          <View style={styles.filterRow}>
            {['All', ...courseOptions].map((course) => (
              <TouchableOpacity
                key={course}
                style={[
                  styles.filterChip,
                  selectedCourse === course && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCourse === course && styles.filterChipTextActive,
                  ]}
                >
                  {course}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Search / Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Menu Items</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No matching menu items found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <MenuItemCard
                item={item}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>

      <MenuFormModal
        visible={modalVisible}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  searchSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterChipText: {
    color: '#374151',
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#374151',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});