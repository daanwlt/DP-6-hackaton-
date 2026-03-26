import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  clamp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_GREEN } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlattegrondKaart'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_IN_SCALE = 2.5;

/** Where "Je bent hier" pin sits as fraction of the image (0..1). */
const PIN_X = 0.35;
const PIN_Y = 0.65;

const PIN_SIZE = 28;
const DOUBLE_TAP_DELAY = 300; // ms

// ─── Main screen ──────────────────────────────────────────────────────────────

export function PlattegrondKaartScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();

  // Map container size (set on layout)
  const [mapSize, setMapSize] = useState({ width: winW, height: winH * 0.75 });

  // Zoom & pan state (using plain refs for gesture maths, Reanimated for rendering)
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch tracking refs
  const lastScale = useRef(1);
  const lastTx = useRef(0);
  const lastTy = useRef(0);
  const initialPinchDist = useRef<number | null>(null);
  const initialPinchScale = useRef(1);

  // Double-tap tracking
  const lastTapTime = useRef(0);
  const isZoomedIn = useRef(false);

  // ── Clamp translation so map never shows blank space ──────────────────────
  function clampTranslation(tx: number, ty: number, s: number) {
    const mapW = mapSize.width;
    const mapH = mapSize.height;
    const maxTx = (mapW * (s - 1)) / 2;
    const maxTy = (mapH * (s - 1)) / 2;
    return {
      tx: Math.max(-maxTx, Math.min(maxTx, tx)),
      ty: Math.max(-maxTy, Math.min(maxTy, ty)),
    };
  }

  // ── PanResponder ──────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        lastTx.current = translateX.value;
        lastTy.current = translateY.value;
        lastScale.current = scale.value;

        if (touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
          initialPinchScale.current = scale.value;
        } else {
          initialPinchDist.current = null;
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2 && initialPinchDist.current !== null) {
          // ── Pinch to zoom ──
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const newScale = clamp(
            initialPinchScale.current * (dist / initialPinchDist.current),
            MIN_SCALE,
            MAX_SCALE,
          );
          scale.value = newScale;
          lastScale.current = newScale;

          const { tx, ty } = clampTranslation(lastTx.current, lastTy.current, newScale);
          translateX.value = tx;
          translateY.value = ty;
        } else if (touches.length === 1 && scale.value > 1) {
          // ── Pan (only when zoomed in) ──
          const newTx = lastTx.current + gestureState.dx;
          const newTy = lastTy.current + gestureState.dy;
          const { tx, ty } = clampTranslation(newTx, newTy, scale.value);
          translateX.value = tx;
          translateY.value = ty;
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        // Detect double-tap (single finger, tiny movement)
        const touches = evt.nativeEvent.touches;
        if (touches.length === 0 && Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          const now = Date.now();
          if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
            // Double tap → toggle zoom
            if (isZoomedIn.current) {
              scale.value = withTiming(1, { duration: 300 });
              translateX.value = withTiming(0, { duration: 300 });
              translateY.value = withTiming(0, { duration: 300 });
              lastScale.current = 1;
              lastTx.current = 0;
              lastTy.current = 0;
            } else {
              scale.value = withTiming(ZOOM_IN_SCALE, { duration: 300 });
              translateX.value = withTiming(0, { duration: 300 });
              translateY.value = withTiming(0, { duration: 300 });
              lastScale.current = ZOOM_IN_SCALE;
              lastTx.current = 0;
              lastTy.current = 0;
            }
            isZoomedIn.current = !isZoomedIn.current;
            lastTapTime.current = 0; // reset so next tap starts fresh
            return;
          }
          lastTapTime.current = now;
        }
        // Save final translation
        lastTx.current = translateX.value;
        lastTy.current = translateY.value;
      },
    }),
  ).current;

  // ── Animated style ────────────────────────────────────────────────────────
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // ── Pin position (always relative to image, not affected by transform
  //    because we put the pin INSIDE the Animated.View) ─────────────────────
  const pinLeft = PIN_X * mapSize.width - PIN_SIZE / 2;
  const pinTop  = PIN_Y * mapSize.height - PIN_SIZE;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Toolbar ── */}
      <View style={s.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.55 }]}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Text style={s.toolbarTitle}>Plattegrond</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* ── Hint ── */}
      <Text style={s.hint}>Dubbeltik om in te zoomen · Sleep om te bewegen</Text>

      {/* ── Map area ── */}
      <View
        style={s.mapContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setMapSize({ width, height });
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[s.animWrapper, animStyle]}>

          {/* Floor plan image */}
          <Image
            source={require('../assets/plattegrond.png')}
            style={{ width: mapSize.width, height: mapSize.height }}
            contentFit="contain"
            accessibilityLabel="Plattegrond van het gebouw"
          />

          {/* "Je bent hier" pin */}
          <View style={[s.pinWrap, { left: pinLeft, top: pinTop }]}>
            <Ionicons name="location" size={PIN_SIZE} color="#e53935" />
            <View style={s.pinLabelBubble}>
              <Text style={s.pinLabelText}>Je bent hier</Text>
            </View>
          </View>

        </Animated.View>
      </View>

      {/* ── Zoom hint buttons (decorative, zoom is gesture-only) ── */}
      <View style={[s.zoomBtns, { bottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Inzoomen"
          onPress={() => {
            const next = clamp(scale.value * 1.5, MIN_SCALE, MAX_SCALE);
            scale.value = withTiming(next, { duration: 250 });
            lastScale.current = next;
            isZoomedIn.current = next > 1;
            const { tx, ty } = clampTranslation(translateX.value, translateY.value, next);
            translateX.value = withTiming(tx, { duration: 250 });
            translateY.value = withTiming(ty, { duration: 250 });
            lastTx.current = tx;
            lastTy.current = ty;
          }}
          style={({ pressed }) => [s.zoomBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="add" size={22} color="#000" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Uitzoomen"
          onPress={() => {
            const next = clamp(scale.value / 1.5, MIN_SCALE, MAX_SCALE);
            scale.value = withTiming(next, { duration: 250 });
            lastScale.current = next;
            isZoomedIn.current = next > 1;
            const { tx, ty } = clampTranslation(translateX.value, translateY.value, next);
            translateX.value = withTiming(tx, { duration: 250 });
            translateY.value = withTiming(ty, { duration: 250 });
            lastTx.current = tx;
            lastTy.current = ty;
          }}
          style={({ pressed }) => [s.zoomBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="remove" size={22} color="#000" />
        </Pressable>
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fdfdc2' },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  toolbarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },

  hint: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },

  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0e8',
  },

  animWrapper: {
    // sized by mapSize set on layout
  },

  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinLabelBubble: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e53935',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  pinLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e53935',
  },

  zoomBtns: {
    position: 'absolute',
    right: 14,
    flexDirection: 'column',
    gap: 8,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
