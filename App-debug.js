import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

console.log('App-debug: Starting to render...');

export default function App() {
  console.log('App-debug: Inside component render function');
  
  try {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>DEBUG: App is working!</Text>
        <Text style={styles.subtext}>If you see this, React Native Web is functioning</Text>
      </View>
    );
  } catch (error) {
    console.error('App-debug: Render error:', error);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtext: {
    color: '#ecf0f1',
    fontSize: 16,
    textAlign: 'center',
  },
});

console.log('App-debug: Component defined successfully');