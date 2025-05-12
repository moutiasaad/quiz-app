import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionCard = ({ question, options, selectedOption, correctAnswer, onSelect }) => {
  const getOptionStyle = (option) => {
    if (!selectedOption) return styles.optionButton;
    if (option === correctAnswer) return [styles.optionButton, styles.correctOption];
    if (option === selectedOption) return [styles.optionButton, styles.wrongOption];
    return styles.optionButton;
  };

  return (
    <View>
      <Text style={styles.question}>{question}</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionStyle(option)}
          onPress={() => onSelect(option)}
          disabled={!!selectedOption}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
  question: { fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#2f3640' },
  optionButton: { padding: 15, marginVertical: 8, backgroundColor: '#dcdde1', borderRadius: 8 },
  correctOption: { backgroundColor: '#4cd137' },
  wrongOption: { backgroundColor: '#e84118' },
  optionText: { fontSize: 16, color: '#2f3640' }
});