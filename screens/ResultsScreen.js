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

const { width } = Dimensions.get('window');

export default function ResultsScreen({ route, navigation }) {
  const {
    subject,
    mode,
    totalCards,
    score,
    userAnswers,
    completedAt,
    selectedUnits
  } = route.params;

  const getScorePercentage = () => {
    if (mode === 'quiz' && score !== null) {
      return Math.round((score / totalCards) * 100);
    }
    return null;
  };

  const getPerformanceMessage = () => {
    if (mode === 'flashcard') {
      return {
        title: "Study Session Complete! 📚",
        message: `Great job reviewing ${totalCards} cards! Regular practice helps improve retention.`,
        emoji: "🎉"
      };
    }

    const percentage = getScorePercentage();
    if (percentage >= 90) {
      return {
        title: "Excellent Work! 🌟",
        message: "Outstanding performance! You've mastered this material.",
        emoji: "🏆"
      };
    } else if (percentage >= 80) {
      return {
        title: "Great Job! 👏",
        message: "Solid understanding! A little more practice and you'll be perfect.",
        emoji: "🎯"
      };
    } else if (percentage >= 70) {
      return {
        title: "Good Effort! 💪",
        message: "You're on the right track. Review the missed questions and try again.",
        emoji: "📈"
      };
    } else if (percentage >= 60) {
      return {
        title: "Keep Practicing! 📖",
        message: "More study time needed. Focus on the areas you missed.",
        emoji: "📚"
      };
    } else {
      return {
        title: "Study More! 🤓",
        message: "This topic needs more attention. Don't give up - you can do it!",
        emoji: "💪"
      };
    }
  };

  const performanceData = getPerformanceMessage();

  const goHome = () => {
    navigation.navigate('Home');
  };

  const studyAgain = () => {
    navigation.navigate('Subject', { subject });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIncorrectAnswers = () => {
    if (mode !== 'quiz' || !userAnswers) return [];
    return userAnswers.filter(answer => !answer.correct);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: subject.color }]}>
          <Text style={styles.headerEmoji}>{performanceData.emoji}</Text>
          <Text style={styles.headerTitle}>{performanceData.title}</Text>
          <Text style={styles.headerMessage}>{performanceData.message}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.mainStatCard]}>
            <Text style={styles.statLabel}>Cards Studied</Text>
            <Text style={[styles.statValue, { color: subject.color }]}>
              {totalCards}
            </Text>
            <Text style={styles.statSubtext}>
              {mode === 'flashcard' ? 'Reviewed' : 'Attempted'}
            </Text>
          </View>

          {mode === 'quiz' && score !== null && (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Score</Text>
                <Text style={[styles.statValue, { color: subject.color }]}>
                  {score}/{totalCards}
                </Text>
                <Text style={styles.statSubtext}>Correct</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Accuracy</Text>
                <Text style={[styles.statValue, { color: subject.color }]}>
                  {getScorePercentage()}%
                </Text>
                <Text style={styles.statSubtext}>Overall</Text>
              </View>
            </>
          )}

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statValue, { color: subject.color }]}>
              {formatTime(completedAt)}
            </Text>
            <Text style={styles.statSubtext}>Today</Text>
          </View>
        </View>

        {/* Study Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Subject: {subject.name}</Text>
            <Text style={styles.progressLabel}>
              Mode: {mode === 'flashcard' ? 'Flashcard Review' : 'Quiz Mode'}
            </Text>
            <Text style={styles.progressLabel}>
              Units: {selectedUnits.length} selected
            </Text>
          </View>
        </View>

        {/* Incorrect Answers Review (Quiz Mode Only) */}
        {mode === 'quiz' && getIncorrectAnswers().length > 0 && (
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>
              Review These Questions ({getIncorrectAnswers().length})
            </Text>
            {getIncorrectAnswers().map((answer, index) => (
              <View key={index} style={styles.reviewCard}>
                <Text style={styles.reviewQuestion}>
                  Q: {answer.card.question}
                </Text>
                <Text style={styles.reviewAnswer}>
                  A: {answer.card.answer}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: subject.color }]}
            onPress={studyAgain}
          >
            <Text style={styles.primaryButtonText}>
              {mode === 'flashcard' ? '📚 Study Again' : '🎯 Try Quiz Again'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.statsButton]}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.statsButtonText}>📊 View Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={goHome}
          >
            <Text style={styles.secondaryButtonText}>🏠 Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Encouragement */}
        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementText}>
            {mode === 'flashcard'
              ? "💡 Tip: Regular review sessions help move information from short-term to long-term memory!"
              : `💡 Tip: ${getScorePercentage() >= 80
                ? "Excellent work! Try flashcard mode to reinforce your knowledge."
                : "Review incorrect answers, then try flashcard mode for better retention."}`
            }
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
    paddingBottom: 30,
  },
  header: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 55) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainStatCard: {
    width: '100%',
    flex: 'none',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#95a5a6',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  reviewSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  reviewCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 14,
    color: '#6c5600',
    lineHeight: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 25,
  },
  actionButton: {
    paddingVertical: 18,
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
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statsButton: {
    backgroundColor: '#9b59b6',
  },
  statsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  encouragementCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    color: '#27ae60',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});