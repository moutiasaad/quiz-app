import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';

const ScoreHistoryScreen = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'scores'),
          where('email', '==', user.email),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScores(history);
      } catch (error) {
        console.error('Erreur chargement historique :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text>Chargement de l'historique...</Text>
      </View>
    );
  }

  if (scores.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.empty}>Aucun score enregistré.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Scores</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.score}>
              {item.score} / {item.total}
            </Text>
            <Text style={styles.details}>
              Durée: {item.duration}s | {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ScoreHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2f3640',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
  },
  details: {
    fontSize: 14,
    color: '#636e72',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#999',
  },
});
