import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassPickerModal } from '../components/ClassPickerModal';
import {
  BUTTON_LIME,
  HEADER_GREEN,
  SCHEDULE_FIELD_BACKGROUND,
} from '../constants/colors';
import { useRoosterSettings } from '../context/RoosterSettingsContext';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RoosterToevoegen'>;

function colorsEqual(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Eén groen in het palet = app-standaard (HEADER_GREEN) */
const PALETTE_ROW1 = [
  '#E53935',
  '#FB8C00',
  '#FDD835',
  '#C0CA33',
  HEADER_GREEN,
  '#1E88E5',
];
const PALETTE_ROW2 = [
  '#0097A7',
  '#4FC3F7',
  '#8E24AA',
  '#E91E63',
  '#F48FB1',
  '#9E9E9E',
];

export function RoosterToevoegenScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { classCode, accentColor, accentByClass, applyRoosterChoice } =
    useRoosterSettings();

  const [draftClass, setDraftClass] = useState(classCode);
  const [draftColor, setDraftColor] = useState(accentColor);
  const [classMenuOpen, setClassMenuOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDraftClass(classCode);
      setDraftColor(accentByClass[classCode] ?? HEADER_GREEN);
    }, [classCode, accentByClass]),
  );

  const blockWidth = Math.round(Math.min(windowWidth * 0.68, 292));
  const classCodeWidth = Math.max(188, Math.round(blockWidth * 0.69));
  const footerInnerWidth = windowWidth - 48;
  const footerButtonWidth = Math.round(footerInnerWidth * 0.37);

  const onConfirm = () => {
    applyRoosterChoice(draftClass, draftColor);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </Pressable>
        <Text style={styles.pageTitle} numberOfLines={1}>
          Nieuw rooster
        </Text>
        <View style={styles.toolbarBalance} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formBlock, { width: blockWidth }]}>
          <Text style={styles.fieldLabel}>Selecteer rooster</Text>
          <View style={[styles.roosterSelectWrap, { width: classCodeWidth }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Rooster kiezen, huidige keuze ${draftClass}`}
              onPress={() => setClassMenuOpen(true)}
              style={({ pressed }) => [
                styles.roosterSelect,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.roosterSelectText} numberOfLines={1}>
                {draftClass}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#000000" />
            </Pressable>
          </View>

          <Text style={[styles.fieldLabel, styles.paletteLabelSpacing]}>
            Kleurenpalet
          </Text>
          <View style={[styles.paletteBox, { width: blockWidth }]}>
            <View style={styles.paletteRow}>
              {PALETTE_ROW1.map((color) => (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Kleur ${color}`}
                  accessibilityState={{ selected: colorsEqual(draftColor, color) }}
                  onPress={() => setDraftColor(color)}
                  style={({ pressed }) => [
                    styles.swatch,
                    { backgroundColor: color },
                    colorsEqual(draftColor, color) && styles.swatchSelected,
                    pressed && styles.pressed,
                  ]}
                />
              ))}
            </View>
            <View style={styles.paletteRow}>
              {PALETTE_ROW2.map((color) => (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Kleur ${color}`}
                  accessibilityState={{ selected: colorsEqual(draftColor, color) }}
                  onPress={() => setDraftColor(color)}
                  style={({ pressed }) => [
                    styles.swatch,
                    { backgroundColor: color },
                    colorsEqual(draftColor, color) && styles.swatchSelected,
                    pressed && styles.pressed,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Annuleren"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.footerButton,
            { width: footerButtonWidth },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.footerButtonText}>Annuleren</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bevestigen"
          onPress={onConfirm}
          style={({ pressed }) => [
            styles.footerButton,
            { width: footerButtonWidth },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.footerButtonText}>Bevestigen</Text>
        </Pressable>
      </View>

      <ClassPickerModal
        visible={classMenuOpen}
        onRequestClose={() => setClassMenuOpen(false)}
        selectedClass={draftClass}
        onSelectClass={(opt) => {
          setDraftClass(opt);
          setDraftColor(accentByClass[opt] ?? HEADER_GREEN);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.55,
  },
  pageTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  toolbarBalance: {
    width: 44,
    height: 44,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  formBlock: {
    alignSelf: 'flex-start',
  },
  roosterSelectWrap: {
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  paletteLabelSpacing: {
    marginTop: 22,
    marginBottom: 8,
  },
  roosterSelect: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    backgroundColor: HEADER_GREEN,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 38,
  },
  roosterSelectText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    paddingRight: 8,
  },
  paletteBox: {
    alignSelf: 'stretch',
    flexShrink: 0,
    backgroundColor: SCHEDULE_FIELD_BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 14,
    gap: 11,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  swatch: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  footerButton: {
    backgroundColor: BUTTON_LIME,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
});
