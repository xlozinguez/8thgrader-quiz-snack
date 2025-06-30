import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, AppRegistry, Platform } from 'react-native';

// Import screens (Snack compatibility)
import HomeScreen from './screens/HomeScreen.js';
import SubjectScreen from './screens/SubjectScreen.js';
import QuizScreen from './screens/QuizScreen.js';
import ResultsScreen from './screens/ResultsScreen.js';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#2c3e50" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '8th Grade Quiz App' }}
        />
        <Stack.Screen
          name="Subject"
          component={SubjectScreen}
          options={({ route }) => ({ title: route.params.subject.name })}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={({ route }) => ({
            title: `${route.params.subject.name} ${route.params.mode === 'flashcard' ? 'Study' : 'Quiz'}`,
            headerLeft: null, // Prevent going back during quiz
          })}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Quiz Results',
            headerLeft: null, // Prevent going back to quiz
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Web-specific app registration
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  
  if (typeof document !== 'undefined') {
    AppRegistry.runApplication('main', {
      rootTag: document.getElementById('root'),
    });
  }
}

export default App;