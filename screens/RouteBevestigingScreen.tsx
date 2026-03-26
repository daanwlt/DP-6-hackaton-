import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BUTTON_LIME, HEADER_GREEN } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RouteBevestiging'>;

// ─── Location data ────────────────────────────────────────────────────────────

const BUILDINGS = ["'t Landrost", "'t Circus", 'Zwolle'] as const;
type Building = typeof BUILDINGS[number];

const ROOMS_BY_BUILDING: Record<Building, string[]> = {
  "'t Landrost": ['LA1.01', 'LA1.02', 'LA2.10', 'LA2.11', 'LA3.01', 'LA3.05'],
  "'t Circus":  ['AC1.22', 'AC1.28', 'AC2.38', 'AC2.76', 'AC3.10', 'AC3.12'],
  'Zwolle':     ['ZW1.01', 'ZW1.05', 'ZW2.03', 'ZW2.07', 'ZW3.02'],
};

// ─── Shared dropdown modal ────────────────────────────────────────────────────

function DropdownModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={dd.root}>
        <Pressable style={dd.backdrop} onPress={onClose} />
        <View style={dd.card}>
          <Text style={dd.heading}>{title}</Text>
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => { onSelect(opt); onClose(); }}
              style={({ pressed }) => [
                dd.option,
                selected === opt && dd.optionSelected,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={dd.optionText}>{opt}</Text>
              {selected === opt && (
                <Ionicons name="checkmark" size={18} color="#000" />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const dd = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: HEADER_GREEN,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    zIndex: 1,
    elevation: 6,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#000',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  optionSelected: { backgroundColor: 'rgba(255,255,255,0.22)' },
  optionText: { fontSize: 14, fontWeight: '600', color: '#000', flex: 1 },
});

// ─── Select chip ──────────────────────────────────────────────────────────────

function Chip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [chipS.base, pressed && { opacity: 0.65 }]}
    >
      <Text style={chipS.text} numberOfLines={1}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#000" />
    </Pressable>
  );
}

const chipS = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: HEADER_GREEN,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  text: { fontSize: 13, fontWeight: '600', color: '#000', flexShrink: 1 },
});

// ─── Location column ──────────────────────────────────────────────────────────

function LocationCol({
  heading,
  building,
  room,
  onBuildingPress,
  onRoomPress,
}: {
  heading: string;
  building: string;
  room: string;
  onBuildingPress: () => void;
  onRoomPress: () => void;
}) {
  return (
    <View style={lc.col}>
      <Text style={lc.heading}>{heading}</Text>
      <Text style={lc.sub}>Kies een gebouw</Text>
      <Chip label={building} onPress={onBuildingPress} />
      <Text style={[lc.sub, { marginTop: 10 }]}>Kies een lokaal</Text>
      <Chip label={room} onPress={onRoomPress} />
    </View>
  );
}

const lc = StyleSheet.create({
  col: { flex: 1 },
  heading: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 8 },
  sub: { fontSize: 11, fontWeight: '500', color: '#444', marginBottom: 4 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

type ModalKey =
  | 'startBuilding'
  | 'startRoom'
  | 'destBuilding'
  | 'destRoom'
  | null;

export function RouteBevestigingScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [startBuilding, setStartBuilding] = useState<Building>("'t Circus");
  const [startRoom, setStartRoom]         = useState('AC2.76');

  const [destBuilding, setDestBuilding]   = useState<Building>("'t Circus");
  const [destRoom, setDestRoom]           = useState('AC2.38');

  const [invalide, setInvalide]           = useState(false);
  const [openModal, setOpenModal]         = useState<ModalKey>(null);

  const startRooms = ROOMS_BY_BUILDING[startBuilding];
  const destRooms  = ROOMS_BY_BUILDING[destBuilding];

  const onConfirm = () => {
    navigation.navigate('Plattegrond', {
      startBuilding,
      startRoom,
      destBuilding,
      destRoom,
      invalide,
    });
  };

  return (
    <View style={s.root}>

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
        <Text style={s.toolbarTitle}>Rooster volgen</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Location pickers ── */}
        <View style={s.locRow}>
          <LocationCol
            heading="Begin locatie"
            building={startBuilding}
            room={startRoom}
            onBuildingPress={() => setOpenModal('startBuilding')}
            onRoomPress={() => setOpenModal('startRoom')}
          />
          <LocationCol
            heading="Eind locatie"
            building={destBuilding}
            room={destRoom}
            onBuildingPress={() => setOpenModal('destBuilding')}
            onRoomPress={() => setOpenModal('destRoom')}
          />
        </View>

        {/* ── Map preview ── */}
        <View style={s.mapWrap}>
          <Image
            source={require('../assets/plattegrond.png')}
            style={s.mapImage}
            contentFit="contain"
            accessibilityLabel="Plattegrond van het gebouw"
          />
        </View>

        {/* ── Estimated time ── */}
        <Text style={s.infoText}>Geschatte tijd: 8 min</Text>

        {/* ── Accessibility toggle ── */}
        <View style={s.toggleRow}>
          <Text style={s.toggleLabel}>Invalide-vriendelijk</Text>
          <Switch
            value={invalide}
            onValueChange={setInvalide}
            trackColor={{ false: '#bbb', true: HEADER_GREEN }}
            thumbColor="#fff"
          />
        </View>

      </ScrollView>

      {/* ── Footer ── */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Annuleren"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.footerBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={s.footerBtnText}>Annuleren</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bevestigen"
          onPress={onConfirm}
          style={({ pressed }) => [s.footerBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={s.footerBtnText}>Bevestigen</Text>
        </Pressable>
      </View>

      {/* ── Dropdowns ── */}
      <DropdownModal
        visible={openModal === 'startBuilding'}
        title="Begin gebouw"
        options={BUILDINGS}
        selected={startBuilding}
        onSelect={(v) => {
          const b = v as Building;
          setStartBuilding(b);
          setStartRoom(ROOMS_BY_BUILDING[b][0]);
        }}
        onClose={() => setOpenModal(null)}
      />
      <DropdownModal
        visible={openModal === 'startRoom'}
        title="Begin lokaal"
        options={startRooms}
        selected={startRoom}
        onSelect={setStartRoom}
        onClose={() => setOpenModal(null)}
      />
      <DropdownModal
        visible={openModal === 'destBuilding'}
        title="Eind gebouw"
        options={BUILDINGS}
        selected={destBuilding}
        onSelect={(v) => {
          const b = v as Building;
          setDestBuilding(b);
          setDestRoom(ROOMS_BY_BUILDING[b][0]);
        }}
        onClose={() => setOpenModal(null)}
      />
      <DropdownModal
        visible={openModal === 'destRoom'}
        title="Eind lokaal"
        options={destRooms}
        selected={destRoom}
        onSelect={setDestRoom}
        onClose={() => setOpenModal(null)}
      />

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

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

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  locRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },

  mapWrap: {
    width: '100%',
    aspectRatio: 1.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
    backgroundColor: '#f0f0e8',
    marginBottom: 14,
  },
  mapImage: { width: '100%', height: '100%' },

  infoText: { fontSize: 14, fontWeight: '500', color: '#000', marginBottom: 10 },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: '#000' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: BUTTON_LIME,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnText: { fontSize: 15, fontWeight: '600', color: '#000' },
});
