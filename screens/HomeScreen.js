import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { flashcardsData } from '../data/flashcards.js';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const subjects = Object.values(flashcardsData);

  const navigateToSubject = (subject) => {
    navigation.navigate('Subject', { subject });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back! 📚</Text>
          <Text style={styles.subtitleText}>Choose a subject to start studying</Text>
        </View>

        <View style={styles.subjectsContainer}>
          {subjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.subjectCard, { backgroundColor: subject.color }]}
              onPress={() => navigateToSubject(subject)}
              activeOpacity={0.8}
            >
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectInfo}>
                {subject.units.length} units available
              </Text>
              <View style={styles.cardStats}>
                <Text style={styles.statsText}>
                  {subject.units.reduce((total, unit) => total + unit.cards.length, 0)} cards
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Tip: Study regularly for better retention!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  subjectsContainer: {
    gap: 20,
  },
  subjectCard: {
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 150,
    justifyContent: 'center',
  },
  subjectIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subjectInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});