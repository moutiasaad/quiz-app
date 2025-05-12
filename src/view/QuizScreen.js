import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import QuestionCard from '../components/QuestionCard';

const QuizScreen = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
        const data = querySnapshot.docs.map(doc => doc.data());
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des questions:", error);
      }
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!showScore) {
      const id = setInterval(() => setTimer(prev => prev + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      clearInterval(intervalId);
    }
  }, [showScore]);

  const handleAnswer = (option) => {
    const correctAnswer = quizData[currentQuestion].answer;
    setSelectedOption(option);

    if (option === correctAnswer) {
      setScore(score + 1);
    }
  };
  const handleNext = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };



  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
    setTimer(0);
  };

  if (loading) {
    return (
     <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#00a8ff" style={styles.spinner} />
      <Text style={styles.loadingText}>Chargement des questions...</Text>
    </View>
    );
  }

  if (showScore) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz terminé !</Text>
        <Text style={styles.score}>Score : {score} / {quizData.length}</Text>
        <Text style={styles.timer}>Temps total : {timer} secondes</Text>
        <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
          <Text style={styles.buttonText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} / {quizData.length}
        </Text>
        <Text style={styles.timer}>⏱ {timer}s</Text>
      </View>

      <View style={styles.quizBox}>
        <QuestionCard
          question={quizData[currentQuestion].question}
          options={quizData[currentQuestion].options}
          selectedOption={selectedOption}
          correctAnswer={quizData[currentQuestion].answer}
          onSelect={handleAnswer}
        />
        
      </View>
      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Suivant</Text>
        </TouchableOpacity>
      )}
    </View>
  );

};

export default QuizScreen;

const styles = StyleSheet.create({
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#2f3640',
    fontWeight: '500',
  },

  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  questionCounter: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00a8ff',
  },
  quizBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2f3640',
  },
  score: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: '#27ae60',
  },
  restartButton: {
    backgroundColor: '#e84118',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: '#0984e3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 30,
    elevation: 3,
  },
  nextText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

