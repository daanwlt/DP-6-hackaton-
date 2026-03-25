import { View, Text, StyleSheet } from 'react-native';

import { useFontSizes } from '../hooks/useFontSizes';

export function PlattegrondScreen() {
  const fontSizes = useFontSizes();
  return (
    <View style={styles.root}>
      <Text style={[styles.text, { fontSize: fontSizes.large }]}>Plattegrond (TODO: implementatie)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});