import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScreenWithHeader } from '../components';
import { HomeScreen } from '../screens/HomeScreen';
import { RoosterOverzichtScreen } from '../screens/RoosterOverzichtScreen';
import { RoosterToevoegenScreen } from '../screens/RoosterToevoegenScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeRoute() {
  return (
    <ScreenWithHeader>
      <HomeScreen />
    </ScreenWithHeader>
  );
}

function RoosterOverzichtRoute() {
  return (
    <ScreenWithHeader>
      <RoosterOverzichtScreen />
    </ScreenWithHeader>
  );
}

function RoosterToevoegenRoute() {
  return (
    <ScreenWithHeader>
      <RoosterToevoegenScreen />
    </ScreenWithHeader>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeRoute} />
      <Stack.Screen name="RoosterOverzicht" component={RoosterOverzichtRoute} />
      <Stack.Screen name="RoosterToevoegen" component={RoosterToevoegenRoute} />
    </Stack.Navigator>
  );
}
