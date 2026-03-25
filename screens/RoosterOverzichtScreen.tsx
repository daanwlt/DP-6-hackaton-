import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassPickerModal } from '../components/ClassPickerModal';
import {
  BUTTON_LIME,
  HEADER_GREEN,
  SCHEDULE_FIELD_BACKGROUND,
} from '../constants/colors';
import { useRoosterSettings } from '../context/RoosterSettingsContext';
import { useFontSizes } from '../hooks/useFontSizes';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RoosterOverzicht'>;

type Lesson = {
  id: string;
  course: string;
  room: string;
  start: string;
  end: string;
};

const MOCK_LESSONS: Lesson[] = [
  { id: '1', course: 'WC Casus', room: 'AC1.22/1.24', start: '08:30', end: '10:30' },
  { id: '2', course: 'Advanced AR', room: 'AC1.22/1.24', start: '10:30', end: '12:30' },
  { id: '3', course: 'Advanced AR 2', room: 'AC1.22/1.24', start: '12:30', end: '14:30' },
  { id: '4', course: 'Ethiek', room: 'AC1.28', start: '14:30', end: '16:30' },
];

const DATE_LABEL = 'Vrijdag 27-3-2026';

export function RoosterOverzichtScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { classCode, accentColor, selectClass } = useRoosterSettings();
  const fontSizes = useFontSizes();
  const [classMenuOpen, setClassMenuOpen] = useState(false);

  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug naar startpagina"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </Pressable>
        <Text style={[styles.pageTitle, { fontSize: fontSizes.xlarge }]} numberOfLines={1}>
          Mijn rooster
        </Text>
        <View style={styles.toolbarBalance} />
      </View>

      <ScrollView
        style={[styles.scroll, styles.scrollTransparent]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsColumn}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rooster toevoegen"
            onPress={() => navigation.navigate('RoosterToevoegen')}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.addButtonLabel, { fontSize: fontSizes.medium }]}>Rooster toevoegen</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Klas ${classCode}, tik om te wijzigen`}
            onPress={() => setClassMenuOpen(true)}
            style={({ pressed }) => [
              styles.classChip,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.classCode, { fontSize: fontSizes.medium }]} numberOfLines={1}>
              {classCode}
            </Text>
            <Ionicons name="chevron-down" size={15} color="#000000" />
          </Pressable>
        </View>

        <View style={styles.dateRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vorige dag"
            hitSlop={8}
            onPress={() => {}}
            style={({ pressed }) => [styles.dateArrow, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </Pressable>
          <Text style={[styles.dateText, { fontSize: fontSizes.large }]}>{DATE_LABEL}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volgende dag"
            hitSlop={8}
            onPress={() => {}}
            style={({ pressed }) => [styles.dateArrow, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-forward" size={24} color="#000000" />
          </Pressable>
        </View>

        <View
          style={[styles.scheduleBox, { borderColor: accentColor }]}
          collapsable={false}
        >
          {MOCK_LESSONS.map((lesson) => (
            <View key={lesson.id} style={styles.lessonRow}>
                <View style={[styles.lessonMain, { backgroundColor: accentColor }]}>
                <View style={styles.bookIconWrap}>
                  <Image
                    accessibilityLabel="Les"
                    resizeMode="contain"
                    source={require('../assets/lesson-book.png')}
                    style={styles.lessonBookIcon}
                  />
                </View>
                <View style={styles.lessonTextBlock}>
                  <Text style={[styles.courseName, { fontSize: fontSizes.medium }]}>{lesson.course}</Text>
                  <Text style={[styles.roomText, { fontSize: fontSizes.small }]}>{lesson.room}</Text>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={[styles.timeText, { fontSize: fontSizes.small }]}>{lesson.start}</Text>
                  <Text style={[styles.timeText, { fontSize: fontSizes.small }]}>{lesson.end}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Informatie over ${lesson.course}`}
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.rowIconButton,
                  { backgroundColor: accentColor },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="information-circle" size={28} color="#ffffff" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Verwijder ${lesson.course}`}
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.rowIconButton,
                  { backgroundColor: accentColor },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="trash-outline" size={24} color="#ffffff" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <ClassPickerModal
        visible={classMenuOpen}
        onRequestClose={() => setClassMenuOpen(false)}
        selectedClass={classCode}
        onSelectClass={(opt) => selectClass(opt)}
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
    paddingHorizontal: 8,
    paddingVertical: 6,
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
    fontSize: 20,
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
  },
  scrollTransparent: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  actionsColumn: {
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 40,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: HEADER_GREEN,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: BUTTON_LIME,
    maxWidth: '100%',
  },
  classCode: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateArrow: {
    padding: 4,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    minWidth: 200,
  },
  scheduleBox: {
    backgroundColor: SCHEDULE_FIELD_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 12,
    gap: 12,
    overflow: 'hidden',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lessonMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 10,
    minHeight: 64,
  },
  bookIconWrap: {
    width: 22,
    height: 22,
    marginRight: 8,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonBookIcon: {
    width: '100%',
    height: '100%',
  },
  lessonTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  roomText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    marginTop: 2,
  },
  timeBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 18,
  },
  rowIconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
