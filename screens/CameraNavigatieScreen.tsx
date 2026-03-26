import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import type { RootStackParamList } from '../navigation/types';
import { ARCameraNavigatieFlow } from './ARCameraNavigatieFlow';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CameraNavigatie'>;

/** AR indoor-navigatie (camera + kompas + stappen); feature/ar-flow ingebed in de stack. */
export function CameraNavigatieScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <ARCameraNavigatieFlow
        onExit={() => navigation.goBack()}
        initialScreen="home"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
