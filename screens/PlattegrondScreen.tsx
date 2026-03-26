import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BUTTON_LIME, HEADER_GREEN } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Plattegrond'>;
type RouteP = RouteProp<RootStackParamList, 'Plattegrond'>;

// ─── Step definitions ─────────────────────────────────────────────────────────

type DirectionIcon =
  | 'arrow-up-outline'
  | 'arrow-back-outline'
  | 'arrow-forward-outline'
  | 'checkmark-circle-outline';

interface Step {
  instruction: string;
  detail: string;           // e.g. "15 meter"
  icon: DirectionIcon;
  /** Pin position as fraction of the rendered map (0..1). */
  pinX: number;
  pinY: number;
}

const STEPS: Step[] = [
  {
    instruction: 'Loop rechtdoor',
    detail: '15 meter',
    icon: 'arrow-up-outline',
    pinX: 0.28,
    pinY: 0.70,
  },
  {
    instruction: 'Sla linksaf',
    detail: '8 meter',
    icon: 'arrow-back-outline',
    pinX: 0.36,
    pinY: 0.58,
  },
  {
    instruction: 'Loop rechtdoor',
    detail: '10 meter',
    icon: 'arrow-up-outline',
    pinX: 0.44,
    pinY: 0.52,
  },
  {
    instruction: 'Sla rechtsaf',
    detail: '5 meter',
    icon: 'arrow-forward-outline',
    pinX: 0.52,
    pinY: 0.58,
  },
  {
    instruction: 'Je bent aangekomen',
    detail: 'Bestemming bereikt',
    icon: 'checkmark-circle-outline',
    pinX: 0.52,
    pinY: 0.64,
  },
];

// ─── Static pin ───────────────────────────────────────────────────────────────

const PIN_SIZE = 32;

function StaticPin({ mapWidth, mapHeight, pinX, pinY }: {
  mapWidth: number;
  mapHeight: number;
  pinX: number;
  pinY: number;
}) {
  const left = pinX * mapWidth - PIN_SIZE / 2;
  const top  = pinY * mapHeight - PIN_SIZE;
  return (
    <View style={[pinS.pin, { left, top, width: PIN_SIZE, height: PIN_SIZE }]}>
      <Ionicons name="location" size={PIN_SIZE} color="#e53935" />
    </View>
  );
}

const pinS = StyleSheet.create({
  pin: { position: 'absolute' },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export function PlattegrondScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<RouteP>();
  const insets     = useSafeAreaInsets();

  const { destBuilding, destRoom } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [mapSize, setMapSize]         = useState({ width: 0, height: 0 });

  const step       = STEPS[currentStep];
  const isFirst    = currentStep === 0;
  const isLast     = currentStep === STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setCurrentStep((n) => n + 1);
  };
  const goPrev = () => {
    if (!isFirst) setCurrentStep((n) => n - 1);
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Step banner ── */}
      <View style={s.banner}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug naar bevestigingsscherm"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.bannerSideBtn, pressed && { opacity: 0.55 }]}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>

        <View style={s.bannerCenter}>
          <Text style={s.bannerInstruction}>{step.instruction}</Text>
          <Text style={s.bannerDetail}>{step.detail}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Klaar' : 'Volgende stap'}
          onPress={isLast ? () => navigation.goBack() : goNext}
          style={({ pressed }) => [
            s.bannerSideBtn,
            s.bannerIconBox,
            isLast && s.bannerIconBoxDone,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons name={step.icon} size={22} color="#000" />
        </Pressable>
      </View>

      {/* ── Map title ── */}
      <Text style={s.mapTitle}>Plattegrond</Text>

      {/* ── Floor plan + static pin ── */}
      <View
        style={s.mapWrap}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setMapSize({ width, height });
        }}
      >
        <Image
          source={require('../assets/plattegrond.png')}
          style={s.mapImage}
          contentFit="contain"
          accessibilityLabel="Plattegrond van het gebouw"
        />
        {mapSize.width > 0 && (
          <StaticPin
            mapWidth={mapSize.width}
            mapHeight={mapSize.height}
            pinX={step.pinX}
            pinY={step.pinY}
          />
        )}
      </View>

      {/* ── Step counter + prev/next controls ── */}
      <View style={s.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Vorige stap"
          onPress={goPrev}
          disabled={isFirst}
          style={({ pressed }) => [
            s.controlBtn,
            isFirst && s.controlBtnDisabled,
            pressed && !isFirst && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={isFirst ? '#aaa' : '#000'}
          />
          <Text style={[s.controlBtnText, isFirst && s.controlBtnTextDisabled]}>
            Vorige
          </Text>
        </Pressable>

        <Text style={s.stepCounter}>
          {currentStep + 1} / {STEPS.length}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Klaar, ga terug' : 'Volgende stap'}
          onPress={isLast ? () => navigation.goBack() : goNext}
          style={({ pressed }) => [s.controlBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={s.controlBtnText}>{isLast ? 'Klaar' : 'Volgende'}</Text>
          <Ionicons
            name={isLast ? 'checkmark' : 'chevron-forward'}
            size={20}
            color="#000"
          />
        </Pressable>
      </View>

      {/* ── Destination label ── */}
      <Text style={s.destLabel} numberOfLines={1}>
        Bestemming: {destBuilding} – {destRoom}
      </Text>

      {/* ── Camera footer ── */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Text style={s.cameraLabel}>Camera gebruiken voor navigatie?</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Camera openen"
          onPress={() => navigation.navigate('CameraNavigatie')}
          style={({ pressed }) => [s.cameraBtn, pressed && { opacity: 0.65 }]}
        >
          <Ionicons name="camera" size={22} color="#fff" />
        </Pressable>
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HEADER_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    minHeight: 68,
  },
  bannerSideBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIconBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  bannerIconBoxDone: {
    backgroundColor: BUTTON_LIME,
  },
  bannerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bannerInstruction: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  bannerDetail: {
    fontSize: 13,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    marginTop: 2,
  },

  // Map
  mapTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
    backgroundColor: '#f0f0e8',
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%' },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: BUTTON_LIME,
    minWidth: 90,
    justifyContent: 'center',
  },
  controlBtnDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#bbb',
  },
  controlBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  controlBtnTextDisabled: {
    color: '#aaa',
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  // Destination
  destLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 16,
  },

  // Camera footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: BUTTON_LIME,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  cameraLabel: { fontSize: 13, fontWeight: '500', color: '#000', flex: 1 },
  cameraBtn: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: HEADER_GREEN,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
