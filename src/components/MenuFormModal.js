import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { courseOptions } from '../data/menuData';

export default function MenuFormModal({
  visible,
  editingItem,
  formData,
  setFormData,
  onClose,
  onSave,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Text>

          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Menu item name"
          />

          <Text style={styles.label}>Course</Text>

          <View style={styles.coursePicker}>
            {courseOptions.map((course) => (
              <TouchableOpacity
                key={course}
                style={[
                  styles.courseOption,
                  formData.course === course && styles.courseOptionSelected,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, course }))
                }
              >
                <Text
                  style={[
                    styles.courseOptionText,
                    formData.course === course && styles.courseOptionTextSelected,
                  ]}
                >
                  {course}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, price: text }))
            }
            placeholder="Price"
            keyboardType="decimal-pad"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.buttonText}>
                {editingItem ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    marginTop: 8,
    fontSize: 16,
  },
  coursePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  courseOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
  },
  courseOptionSelected: {
    backgroundColor: '#2563eb',
  },
  courseOptionText: {
    color: '#374151',
    fontWeight: '700',
  },
  courseOptionTextSelected: {
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});