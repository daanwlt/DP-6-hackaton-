import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Menu, ScreenWithHeader } from '../components';
import { HomeScreen } from '../screens/HomeScreen';
import { RoosterOverzichtScreen } from '../screens/RoosterOverzichtScreen';
import { RoosterToevoegenScreen } from '../screens/RoosterToevoegenScreen';
import { InstellingenScreen } from '../screens/InstellingenScreen';
import { PlattegrondScreen } from '../screens/PlattegrondScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader 
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
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
          navigation.navigate('Home');
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
          navigation.navigate('Home');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('Plattegrond');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
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
      <ScreenWithHeader 
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
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
          navigation.navigate('Home');
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
          navigation.navigate('Home');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('Plattegrond');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
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
      <ScreenWithHeader 
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
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
          navigation.navigate('Home');
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
          navigation.navigate('Home');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('Plattegrond');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
        }}
      />
    </>
  );
}

function InstellingenRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader 
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
        <InstellingenScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="Instellingen"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
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
          navigation.navigate('Home');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('Plattegrond');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
        }}
      />
    </>
  );
}

function PlattegrondRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigation>();

  return (
    <>
      <ScreenWithHeader 
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
        <PlattegrondScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="Plattegrond"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
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
          navigation.navigate('Home');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('Plattegrond');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
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
      <Stack.Screen name="Instellingen" component={InstellingenRoute} />
      <Stack.Screen name="Plattegrond" component={PlattegrondRoute} />
    </Stack.Navigator>
  );
}
