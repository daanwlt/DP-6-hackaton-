import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Menu, ScreenWithHeader } from '../components';
import { HomeScreen } from '../screens/HomeScreen';
import { RoosterOverzichtScreen } from '../screens/RoosterOverzichtScreen';
import { RoosterToevoegenScreen } from '../screens/RoosterToevoegenScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader onMenuPress={() => setMenuVisible(true)}>
        <HomeScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="Home"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          // Linked to "Volg mijn rooster" functionality
        }}
        onNavigateMijnRooster={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterOverzicht');
        }}
        onNavigateRoosterToevoegen={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterToevoegen');
        }}
        onNavigateHandmatigeRoute={() => {
          setMenuVisible(false);
          // Linked to "Zelf Lokaal invoeren" functionality
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          // TODO: Navigate to Plattegrond screen
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          // TODO: Navigate to Instellingen screen
        }}
      />
    </>
  );
}

function RoosterOverzichtRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader onMenuPress={() => setMenuVisible(true)}>
        <RoosterOverzichtScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="MijnRooster"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          // Linked to "Volg mijn rooster" functionality
        }}
        onNavigateMijnRooster={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterOverzicht');
        }}
        onNavigateRoosterToevoegen={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterToevoegen');
        }}
        onNavigateHandmatigeRoute={() => {
          setMenuVisible(false);
          // Linked to "Zelf Lokaal invoeren" functionality
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          // TODO: Navigate to Plattegrond screen
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          // TODO: Navigate to Instellingen screen
        }}
      />
    </>
  );
}

function RoosterToevoegenRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader onMenuPress={() => setMenuVisible(true)}>
        <RoosterToevoegenScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="RoosterToevoegen"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          // Linked to "Volg mijn rooster" functionality
        }}
        onNavigateMijnRooster={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterOverzicht');
        }}
        onNavigateRoosterToevoegen={() => {
          setMenuVisible(false);
          navigation.navigate('RoosterToevoegen');
        }}
        onNavigateHandmatigeRoute={() => {
          setMenuVisible(false);
          // Linked to "Zelf Lokaal invoeren" functionality
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          // TODO: Navigate to Plattegrond screen
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          // TODO: Navigate to Instellingen screen
        }}
      />
    </>
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
