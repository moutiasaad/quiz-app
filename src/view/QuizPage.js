import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
const QuizPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const navigation = useNavigation();
  // 🔁 Fetch depuis Firebase
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
        const data = querySnapshot.docs.map(doc => doc.data());
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des questions :", error);
      }
    };
    fetchQuiz();
  }, []);

  const startQuiz = () => {
    setHasStarted(true);
  };

  const handleNext = async () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);

      // ✅ Send score to Firestore
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        await addDoc(collection(db, 'scores'), {
          email: user?.email || 'invité',
          score: score,
          total: quizData.length,
          timestamp: new Date().toISOString(),
          duration: timer
        });
        console.log('Score enregistré avec succès.');
      } catch (error) {
        console.error('Erreur enregistrement score :', error);
      }
    }
  };


  const restartQuiz = () => {
    setHasStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0097e6" />
        <Text>Chargement des questions...</Text>
      </View>
    );
  }

  if (!hasStarted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View >
          <Text style={styles.title}>Bienvenue au Quiz Systèmes Embarqués !</Text>
          <Text style={styles.subtitle}>Testez vos connaissances sur les systèmes embarqués.</Text>

          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.buttonText}>Commencer le Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
            <Text style={styles.buttonText}>Historique des scores</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      );

  }

  return (
    <View style={styles.container}>
      {showScore ? (
        <View style={styles.center}>
          <Text style={styles.title}>Quiz terminé !</Text>
          <Text style={styles.score}>Votre score : {score} / {quizData.length}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Recommencer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.question}>
            {quizData[currentQuestion].question}
          </Text>

          {quizData[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.nextButton, !selectedOption && styles.disabledButton]}
            onPress={handleNext}
            disabled={!selectedOption}
          >
            <Text style={styles.buttonText}>Suivant</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default QuizPage;


const styles = StyleSheet.create({
  scrollContent: {
  padding: 20,
  backgroundColor: '#f5f6fa',
  justifyContent: 'flex-start',
  paddingTop: 60,
},
 container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
    justifyContent: 'flex-start', // ✅ Allows all buttons to show
    paddingTop: 60,               // Optional: Pushes content down
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2f3640',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#353b48',
  },  
  

  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2f3640',
  },
  optionButton: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#dcdde1',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#4cd137',
  },
  optionText: {
    fontSize: 16,
    color: '#2f3640',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#00a8ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#dcdde1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
      backgroundColor: '#34495e',
      padding: 15,
      borderRadius: 8,
      marginTop: 15,
      alignItems: 'center',
    },

  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#44bd32',
  },
  restartButton: {
    backgroundColor: '#e84118',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#0097e6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  }
});
