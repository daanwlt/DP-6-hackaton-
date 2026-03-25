import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_GREEN } from '../constants/colors';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
};

export function AppHeader({ onMenuPress, onSettingsPress }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shell, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Menu"
          hitSlop={10}
          onPress={onMenuPress}
          style={({ pressed }) => [styles.sideLeft, pressed && styles.pressed]}
        >
          <Ionicons name="menu" size={28} color="#000000" />
        </Pressable>

        <View style={styles.center}>
          <Image
            accessibilityLabel="hogeschool Windesheim"
            accessibilityRole="image"
            source={require('../assets/windesheim-logo.png')}
            style={styles.logo}
            contentFit="contain"
            transition={0}
            cachePolicy="memory-disk"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Instellingen"
          hitSlop={10}
          onPress={onSettingsPress}
          style={({ pressed }) => [styles.sideRight, pressed && styles.pressed]}
        >
          <Ionicons name="settings-sharp" size={26} color="#000000" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: HEADER_GREEN,
    paddingBottom: 10,
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    overflow: 'visible',
  },
  sideLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 2,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'visible',
  },
  sideRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.65,
  },
  logo: {
    width: '100%',
    maxWidth: 340,
    height: 64,
    backgroundColor: 'transparent',
  },
});
