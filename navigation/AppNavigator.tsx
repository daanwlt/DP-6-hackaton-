import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScreenWithHeader } from '../components';
import { HomeScreen } from '../screens/HomeScreen';
import { PlattegrondScreen } from '../screens/PlattegrondScreen';
import { RouteBevestigingScreen } from '../screens/RouteBevestigingScreen';
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

function RouteBevestigingRoute() {
  return (
    <ScreenWithHeader>
      <RouteBevestigingScreen />
    </ScreenWithHeader>
  );
}

// PlattegrondScreen uses its own full-screen layout (step banner + footer)
// so we do NOT wrap it in ScreenWithHeader
function PlattegrondRoute() {
  return <PlattegrondScreen />;
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeRoute} />
      <Stack.Screen name="RoosterOverzicht" component={RoosterOverzichtRoute} />
      <Stack.Screen name="RoosterToevoegen" component={RoosterToevoegenRoute} />
      <Stack.Screen name="RouteBevestiging" component={RouteBevestigingRoute} />
      <Stack.Screen name="Plattegrond" component={PlattegrondRoute} />
    </Stack.Navigator>
  );
}
