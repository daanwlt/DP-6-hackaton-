import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { HEADER_GREEN } from '../constants/colors';
import { CLASS_OPTIONS } from '../context/RoosterSettingsContext';

export type ClassPickerModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  selectedClass: string;
  onSelectClass: (classCode: string) => void;
};

export function ClassPickerModal({
  visible,
  onRequestClose,
  selectedClass,
  onSelectClass,
}: ClassPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sluiten"
          style={styles.modalBackdrop}
          onPress={onRequestClose}
        />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Kies een klas</Text>
          {CLASS_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedClass === opt }}
              onPress={() => {
                onSelectClass(opt);
                onRequestClose();
              }}
              style={({ pressed }) => [
                styles.modalOption,
                selectedClass === opt && styles.modalOptionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.modalOptionText}>{opt}</Text>
              {selectedClass === opt ? (
                <Ionicons name="checkmark" size={20} color="#000000" />
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.55,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    zIndex: 1,
    elevation: 6,
    backgroundColor: HEADER_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#000000',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
});
