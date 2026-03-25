import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RoosterSettingsProvider } from './context/RoosterSettingsContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RoosterSettingsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RoosterSettingsProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
