import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import SubjectScreen from './screens/SubjectScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createStackNavigator();

export default function App() {
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

// Removed unused styles