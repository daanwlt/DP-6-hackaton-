import { View, Text, StyleSheet } from 'react-native';

export function PlattegrondScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Plattegrond (TODO: implementatie)</Text>
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