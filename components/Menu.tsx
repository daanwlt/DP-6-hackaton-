import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { HEADER_GREEN } from '../constants/colors';

export type MenuProps = {
  visible: boolean;
  onRequestClose: () => void;
  activeScreen?: string;
  onNavigateHome?: () => void;
  onNavigateRoosterVolgen?: () => void;
  onNavigateMijnRooster?: () => void;
  onNavigateRoosterToevoegen?: () => void;
  onNavigateHandmatigeRoute?: () => void;
  onNavigatePlattegrond?: () => void;
  onNavigateInstellingen?: () => void;
};

export function Menu({
  visible,
  onRequestClose,
  activeScreen = 'Home',
  onNavigateHome,
  onNavigateRoosterVolgen,
  onNavigateMijnRooster,
  onNavigateRoosterToevoegen,
  onNavigateHandmatigeRoute,
  onNavigatePlattegrond,
  onNavigateInstellingen,
}: MenuProps) {
  const menuItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: 'home',
      onPress: onNavigateHome,
    },
    {
      id: 'RoosterVolgen',
      label: 'Rooster volgen',
      icon: 'play-circle',
      onPress: onNavigateRoosterVolgen,
    },
    {
      id: 'MijnRooster',
      label: 'Mijn Rooster',
      icon: 'calendar',
      onPress: onNavigateMijnRooster,
    },
    {
      id: 'RoosterToevoegen',
      label: 'Rooster toevoegen',
      icon: 'add-circle',
      onPress: onNavigateRoosterToevoegen,
    },
    {
      id: 'HandmatigeRoute',
      label: 'Handmatig route invoeren',
      icon: 'navigate',
      onPress: onNavigateHandmatigeRoute,
    },
    {
      id: 'Plattegrond',
      label: 'Plattegrond',
      icon: 'map',
      onPress: onNavigatePlattegrond,
    },
    {
      id: 'Instellingen',
      label: 'Instellingen',
      icon: 'settings',
      onPress: onNavigateInstellingen,
    },
  ];

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
          accessibilityLabel="Sluiten menu"
          style={styles.modalBackdrop}
          onPress={onRequestClose}
        />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Menu</Text>

          {menuItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: isActive ? '#B1D249' : '#DDFFC2',
                  },
                  pressed && styles.pressedOverlay,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color="#000000"
                />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: '#45B97C',
    padding: 0,
    paddingTop: 64,
    marginTop: 0,
    marginHorizontal: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    color: '#000000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 0,
    marginVertical: 0,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#000000',
  },
  pressedOverlay: {
    opacity: 0.8,
  },
});