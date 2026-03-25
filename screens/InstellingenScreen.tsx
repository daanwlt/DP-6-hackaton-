import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HEADER_GREEN } from '../constants/colors';

type Props = {};

export function InstellingenScreen(_: Props) {
  const navigation = useNavigation();

  const [kleurenblind, setKleurenblind] = useState(false);
  const [groterLetter, setGroterLetter] = useState(false);
  const [rolstoelRoute, setRolstoelRoute] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Terug"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </Pressable>
        <Text style={styles.pageTitle}>Instellingen</Text>
        <View style={styles.headerOffset} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Kleurenblind modus</Text>
        <Switch
          value={kleurenblind}
          onValueChange={setKleurenblind}
          thumbColor={kleurenblind ? '#ffffff' : '#ffffff'}
          trackColor={{ false: '#c4c4c4', true: '#45B97C' }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Groter lettertype</Text>
        <Switch
          value={groterLetter}
          onValueChange={setGroterLetter}
          thumbColor={groterLetter ? '#ffffff' : '#ffffff'}
            trackColor={{ false: '#c4c4c4', true: '#45B97C' }}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Rolstoelvriendelijke route</Text>
          <Switch
            value={rolstoelRoute}
            onValueChange={setRolstoelRoute}
            thumbColor={rolstoelRoute ? '#ffffff' : '#ffffff'}
            trackColor={{ false: '#c4c4c4', true: '#45B97C' }}
          />
        </View>

        <Text style={styles.sectionTitle}>Help</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Meestgestelde vragen"
          onPress={() => {}}
          style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
        >
          <Text style={styles.helpButtonText}>Meestgestelde vragen</Text>
        </Pressable>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerOffset: {
    width: 44,
    height: 44,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff00',
    marginBottom: 12,
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  helpButton: {
    backgroundColor: '#C4E88C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#051B07',
  }
});