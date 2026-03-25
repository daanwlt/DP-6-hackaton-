import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BUTTON_LIME, HEADER_GREEN } from '../constants/colors';

const BORDER = '#000000';

const BUTTON_SHADOW = Platform.select({
  ios: {
    shadowColor: '#243529',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 1,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

const BUTTONS: { label: string; tone: 'header' | 'lime' }[] = [
  { label: 'Volg mijn rooster', tone: 'header' },
  { label: 'Zelf Lokaal invoeren', tone: 'lime' },
  { label: 'Rooster bekijken of toevoegen', tone: 'lime' },
  { label: 'Plattegrond', tone: 'lime' },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, 16) + 28 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Welkom!</Text>

      <Text style={styles.subtitle}>
        Waar wil je naartoe?{'\n'}Kies een optie hieronder.
      </Text>

      <View style={styles.buttons}>
        {BUTTONS.map(({ label, tone }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => {
              // Navigatie volgt
            }}
            style={({ pressed }) => [
              styles.button,
              tone === 'header' ? styles.buttonHeader : styles.buttonLime,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  /** Eén blok zoals wireframe: strakke regelafstand tussen de twee zinnen */
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 21,
    marginBottom: 36,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  buttons: {
    width: '100%',
    gap: 14,
  },
  button: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 18,
    paddingHorizontal: 14,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...BUTTON_SHADOW,
  },
  buttonHeader: {
    backgroundColor: HEADER_GREEN,
  },
  buttonLime: {
    backgroundColor: BUTTON_LIME,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 4,
  },
});
