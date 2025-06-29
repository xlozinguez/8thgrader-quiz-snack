import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Alert 
} from 'react-native';

export default function SubjectScreen({ route, navigation }) {
  const { subject } = route.params;
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [quizMode, setQuizMode] = useState('flashcard'); // 'flashcard' or 'quiz'

  const toggleUnit = (unitId) => {
    setSelectedUnits(prev => {
      if (prev.includes(unitId)) {
        return prev.filter(id => id !== unitId);
      } else {
        return [...prev, unitId];
      }
    });
  };

  const selectAllUnits = () => {
    if (selectedUnits.length === subject.units.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(subject.units.map(unit => unit.id));
    }
  };

  const startStudying = () => {
    if (selectedUnits.length === 0) {
      Alert.alert('No Units Selected', 'Please select at least one unit to study.');
      return;
    }

    const selectedCards = subject.units
      .filter(unit => selectedUnits.includes(unit.id))
      .flatMap(unit => unit.cards);

    navigation.navigate('Quiz', { 
      subject, 
      cards: selectedCards,
      mode: quizMode,
      selectedUnits: selectedUnits
    });
  };

  const getTotalCards = () => {
    return subject.units
      .filter(unit => selectedUnits.includes(unit.id))
      .reduce((total, unit) => total + unit.cards.length, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: subject.color }]}>
          <Text style={styles.headerIcon}>{subject.icon}</Text>
          <Text style={styles.headerTitle}>{subject.name}</Text>
          <Text style={styles.headerSubtitle}>
            {subject.units.length} units • {subject.units.reduce((total, unit) => total + unit.cards.length, 0)} total cards
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[styles.modeButton, quizMode === 'flashcard' && styles.modeButtonActive]}
              onPress={() => setQuizMode('flashcard')}
            >
              <Text style={[styles.modeText, quizMode === 'flashcard' && styles.modeTextActive]}>
                📋 Flashcards
              </Text>
              <Text style={[styles.modeDesc, quizMode === 'flashcard' && styles.modeDescActive]}>
                Review cards at your own pace
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, quizMode === 'quiz' && styles.modeButtonActive]}
              onPress={() => setQuizMode('quiz')}
            >
              <Text style={[styles.modeText, quizMode === 'quiz' && styles.modeTextActive]}>
                🎯 Quiz Mode
              </Text>
              <Text style={[styles.modeDesc, quizMode === 'quiz' && styles.modeDescActive]}>
                Test your knowledge
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Units</Text>
            <TouchableOpacity onPress={selectAllUnits} style={styles.selectAllButton}>
              <Text style={styles.selectAllText}>
                {selectedUnits.length === subject.units.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {subject.units.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              testID={`unit-${unit.id}`}
              style={[
                styles.unitCard,
                selectedUnits.includes(unit.id) && styles.unitCardSelected
              ]}
              onPress={() => toggleUnit(unit.id)}
            >
              <View style={styles.unitInfo}>
                <Text style={[
                  styles.unitName,
                  selectedUnits.includes(unit.id) && styles.unitNameSelected
                ]}>
                  Unit {unit.id}: {unit.name}
                </Text>
                <Text style={[
                  styles.unitCards,
                  selectedUnits.includes(unit.id) && styles.unitCardsSelected
                ]}>
                  {unit.cards.length} cards
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedUnits.includes(unit.id) && styles.checkboxSelected
              ]}>
                {selectedUnits.includes(unit.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedUnits.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {selectedUnits.length} unit{selectedUnits.length !== 1 ? 's' : ''} selected • {getTotalCards()} cards
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: subject.color },
            selectedUnits.length === 0 && styles.startButtonDisabled
          ]}
          onPress={startStudying}
          disabled={selectedUnits.length === 0}
        >
          <Text style={styles.startButtonText}>
            {quizMode === 'flashcard' ? '📚 Start Studying' : '🎯 Start Quiz'}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
  },
  header: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3498db',
    borderRadius: 15,
  },
  selectAllText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  modeButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  modeTextActive: {
    color: '#3498db',
  },
  modeDesc: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  modeDescActive: {
    color: '#3498db',
  },
  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  unitCardSelected: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  unitNameSelected: {
    color: '#3498db',
  },
  unitCards: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  unitCardsSelected: {
    color: '#3498db',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summaryCard: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  startButton: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});