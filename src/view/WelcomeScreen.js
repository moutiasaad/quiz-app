import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Bienvenue au Quiz Systèmes Embarqués</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Quiz')}>
      <Text style={styles.buttonText}>Commencer le Quiz</Text>
    </TouchableOpacity>
  </View>
);

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#0097e6', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' }
});
