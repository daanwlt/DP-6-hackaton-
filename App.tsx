import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ScreenWithHeader } from './components';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ScreenWithHeader>
        <HomeScreen />
      </ScreenWithHeader>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
