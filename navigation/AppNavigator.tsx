import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Menu, ScreenWithHeader } from '../components';
import { HomeScreen } from '../screens/HomeScreen';
import { InstellingenScreen } from '../screens/InstellingenScreen';
import { CameraNavigatieScreen } from '../screens/CameraNavigatieScreen';
import { PlattegrondKaartScreen } from '../screens/PlattegrondKaartScreen';
import { PlattegrondScreen } from '../screens/PlattegrondScreen';
import { RouteBevestigingScreen } from '../screens/RouteBevestigingScreen';
import { RoosterOverzichtScreen } from '../screens/RoosterOverzichtScreen';
import { RoosterToevoegenScreen } from '../screens/RoosterToevoegenScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function HomeRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<RootNav>();

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
          navigation.navigate('RouteBevestiging');
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
          navigation.navigate('ZelfLokaalInvoeren');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('PlattegrondKaart');
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
  const navigation = useNavigation<RootNav>();

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
          navigation.navigate('RouteBevestiging');
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
          navigation.navigate('ZelfLokaalInvoeren');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('PlattegrondKaart');
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
  const navigation = useNavigation<RootNav>();

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
          navigation.navigate('RouteBevestiging');
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
          navigation.navigate('ZelfLokaalInvoeren');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('PlattegrondKaart');
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
  const navigation = useNavigation<RootNav>();

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
          navigation.navigate('RouteBevestiging');
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
          navigation.navigate('ZelfLokaalInvoeren');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('PlattegrondKaart');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
        }}
      />
    </>
  );
}

/** Zelfde inhoud voor RouteBevestiging en ZelfLokaalInvoeren (aparte stack-instanties). */
function RouteBevestigingFlowRoute() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<RootNav>();

  return (
    <>
      <ScreenWithHeader
        onMenuPress={() => setMenuVisible(true)}
        onSettingsPress={() => navigation.navigate('Instellingen')}
      >
        <RouteBevestigingScreen />
      </ScreenWithHeader>
      <Menu
        visible={menuVisible}
        activeScreen="RoosterVolgen"
        onRequestClose={() => setMenuVisible(false)}
        onNavigateHome={() => {
          setMenuVisible(false);
          navigation.navigate('Home');
        }}
        onNavigateRoosterVolgen={() => {
          setMenuVisible(false);
          navigation.navigate('RouteBevestiging');
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
          navigation.navigate('ZelfLokaalInvoeren');
        }}
        onNavigatePlattegrond={() => {
          setMenuVisible(false);
          navigation.navigate('PlattegrondKaart');
        }}
        onNavigateInstellingen={() => {
          setMenuVisible(false);
          navigation.navigate('Instellingen');
        }}
      />
    </>
  );
}

/** Volledig scherm (eigen header/footer in het scherm). */
function PlattegrondRoute() {
  return <PlattegrondScreen />;
}

function PlattegrondKaartRoute() {
  return <PlattegrondKaartScreen />;
}

function CameraNavigatieRoute() {
  return <CameraNavigatieScreen />;
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeRoute} />
      <Stack.Screen name="RoosterOverzicht" component={RoosterOverzichtRoute} />
      <Stack.Screen name="RoosterToevoegen" component={RoosterToevoegenRoute} />
      <Stack.Screen name="Instellingen" component={InstellingenRoute} />
      <Stack.Screen name="RouteBevestiging" component={RouteBevestigingFlowRoute} />
      <Stack.Screen name="ZelfLokaalInvoeren" component={RouteBevestigingFlowRoute} />
      <Stack.Screen name="Plattegrond" component={PlattegrondRoute} />
      <Stack.Screen name="PlattegrondKaart" component={PlattegrondKaartRoute} />
      <Stack.Screen name="CameraNavigatie" component={CameraNavigatieRoute} />
    </Stack.Navigator>
  );
}
