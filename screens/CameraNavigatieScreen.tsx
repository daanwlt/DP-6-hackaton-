import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_GREEN } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CameraNavigatie'>;

export function CameraNavigatieScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.55 }]}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.title}>Camera navigatie</Text>
        <View style={styles.toolbarBalance} />
      </View>

      <View style={styles.body}>
        <Text style={styles.placeholder}>
          Hier komt de cameraweergave voor navigatie.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5e8' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: HEADER_GREEN,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  toolbarBalance: { width: 44, height: 44 },
  body: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
