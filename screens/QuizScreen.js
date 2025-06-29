import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function QuizScreen({ route, navigation }) {
  const { subject, cards, mode, selectedUnits } = route.params;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));

  // Simplified state management
  const [answered, setAnswered] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerOptions, setAnswerOptions] = useState([]);

  // Initialize cards once when component mounts
  useEffect(() => {
    if (mode === 'flashcard') {
      // For flashcard mode, keep original order for predictable navigation
      setShuffledCards([...cards]);
    } else {
      // For quiz mode, shuffle for variety
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
    }
  }, [cards, mode]);

  // Animate progress bar when card index changes
  useEffect(() => {
    if (shuffledCards.length > 0) {
      Animated.timing(progressAnimation, {
        toValue: (currentCardIndex + 1) / shuffledCards.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentCardIndex, shuffledCards.length, progressAnimation]);

  // Generate multiple choice options for current question
  const generateAnswerOptions = React.useCallback((currentCard, allCards) => {
    if (mode !== 'quiz') return [];

    const wrongAnswers = allCards
      .filter(card => card.answer !== currentCard.answer)
      .map(card => card.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [currentCard.answer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5)
      .map((answer, index) => ({
        text: answer,
        isCorrect: answer === currentCard.answer,
        id: index
      }));

    return options;
  }, [mode]);

  // Reset question state when card changes
  useEffect(() => {
    setAnswered(false);
    setShowingAnswer(false);
    setShowAnswer(false);

    // Generate new answer options for quiz mode
    if (mode === 'quiz' && shuffledCards.length > 0) {
      const options = generateAnswerOptions(shuffledCards[currentCardIndex], shuffledCards);
      setAnswerOptions(options);
    }
  }, [currentCardIndex, shuffledCards, mode, generateAnswerOptions]);

  // Animate card flip when showing answer in quiz mode
  useEffect(() => {
    if (mode === 'quiz') {
      Animated.timing(flipAnimation, {
        toValue: showingAnswer ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showingAnswer, mode, flipAnimation]);

  const flipCard = () => {
    if (mode === 'flashcard') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Animated.timing(flipAnimation, {
        toValue: showAnswer ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setShowAnswer(!showAnswer);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      flipAnimation.setValue(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      finishSession();
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
      flipAnimation.setValue(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleQuizAnswer = (selectedOption) => {
    // Prevent multiple answers for the same question
    if (answered) {
      return;
    }

    const isCorrect = selectedOption.isCorrect;

    const newAnswer = {
      card: shuffledCards[currentCardIndex],
      correct: isCorrect,
      selectedAnswer: selectedOption.text,
      timestamp: Date.now()
    };

    setUserAnswers(prev => [...prev, newAnswer]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Update state to show answer and continue button
    setAnswered(true);
    setShowingAnswer(true);
  };

  const finishSession = () => {
    const sessionData = {
      subject,
      mode,
      totalCards: shuffledCards.length,
      score: mode === 'quiz' ? score : null,
      userAnswers: mode === 'quiz' ? userAnswers : null,
      completedAt: Date.now(),
      selectedUnits
    };

    navigation.navigate('Results', sessionData);
  };

  const showExitConfirmation = () => {
    Alert.alert(
      'Exit Session?',
      `Are you sure you want to exit? You've completed ${currentCardIndex + 1} of ${shuffledCards.length} cards.`,
      [
        { text: 'Continue Studying', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (shuffledCards.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading cards...</Text>
      </View>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const progress = (currentCardIndex + 1) / shuffledCards.length;

  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: subject.color
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} of {shuffledCards.length}
          </Text>
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={flipCard}
            activeOpacity={mode === 'flashcard' ? 0.8 : 1}
          >
            {/* Front of Card */}
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                { backgroundColor: subject.color },
                {
                  transform: [{ rotateY: frontRotation }],
                  opacity: frontOpacity,
                }
              ]}
            >
              <Text style={styles.cardLabel}>Question</Text>
              <Text style={styles.cardText}>{currentCard.question}</Text>
              {mode === 'flashcard' && (
                <Text style={styles.tapHint}>Tap to reveal answer</Text>
              )}
            </Animated.View>

            {/* Back of Card */}
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  transform: [{ rotateY: backRotation }],
                  opacity: backOpacity,
                }
              ]}
            >
              <Text style={styles.cardLabel}>Answer</Text>
              <Text style={styles.cardText}>{currentCard.answer}</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        {mode === 'flashcard' ? (
          <View style={styles.flashcardControls}>
            <TouchableOpacity
              style={[styles.navButton, currentCardIndex === 0 && styles.navButtonDisabled]}
              onPress={previousCard}
              disabled={currentCardIndex === 0}
            >
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.flipButton, { backgroundColor: subject.color }]}
              onPress={flipCard}
            >
              <Text style={styles.flipButtonText}>
                {showAnswer ? 'Show Question' : 'Show Answer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={nextCard}
            >
              <Text style={styles.navButtonText}>
                {currentCardIndex === shuffledCards.length - 1 ? 'Finish' : 'Next →'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View key={`quiz-controls-${currentCardIndex}-${answered}`} style={styles.quizControls}>
            {answered && showingAnswer ? (
              <TouchableOpacity
                testID="continue-button"
                style={[styles.continueButton, { backgroundColor: subject.color }]}
                onPress={nextCard}
              >
                <Text style={styles.continueButtonText}>
                  {currentCardIndex === shuffledCards.length - 1 ? 'See Results' : 'Continue'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.multipleChoiceContainer}>
                {answerOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    testID={`answer-option-${index}`}
                    style={[
                      styles.multipleChoiceButton,
                      answered && option.isCorrect && styles.correctAnswer,
                      answered && !option.isCorrect && styles.incorrectAnswer
                    ]}
                    onPress={() => handleQuizAnswer(option)}
                    disabled={answered}
                  >
                    <Text style={styles.multipleChoiceText}>
                      {String.fromCharCode(65 + index)}. {option.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Exit Button */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={showExitConfirmation}
        >
          <Text style={styles.exitButtonText}>Exit Session</Text>
        </TouchableOpacity>

        {/* Score Display for Quiz Mode */}
        {mode === 'quiz' && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Score: {score}/{userAnswers.length}
            </Text>
          </View>
        )}
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  progressContainer: {
    padding: 15,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardWrapper: {
    width: width - 40,
    height: 220,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    // backgroundColor set dynamically
  },
  cardBack: {
    backgroundColor: '#2c3e50',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    flex: 1,
    textAlignVertical: 'center',
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginTop: 15,
  },
  flashcardControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3498db',
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 16,
  },
  flipButton: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quizControls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  multipleChoiceContainer: {
    gap: 10,
  },
  multipleChoiceButton: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  multipleChoiceText: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
    lineHeight: 20,
  },
  correctAnswer: {
    backgroundColor: '#d4edda',
    borderColor: '#27ae60',
    transform: [{ scale: 0.98 }],
  },
  incorrectAnswer: {
    backgroundColor: '#f8d7da',
    borderColor: '#e74c3c',
    opacity: 0.7,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 20,
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
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  exitButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  exitButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 16,
  },
  scoreContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});