// /app/ReviewForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

export default function ReviewForm({ onSubmitReview }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState('');

  // Validación de la reseña
  const validateReview = () => {
    const wordCount = text.trim().split(/\s+/).length;
    const ratingValue = parseFloat(rating);

    if (wordCount < 15) {
      Alert.alert('Error', 'La reseña debe tener al menos 15 palabras.');
      return false;
    }

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      Alert.alert('Error', 'La calificación debe ser un número entre 1 y 5.');
      return false;
    }

    return true;
  };

  // Manejo del envío del formulario
  const handleSubmit = () => {
    if (validateReview()) {
      onSubmitReview({ text, rating: parseFloat(rating) });
      setText('');
      setRating('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Escribe tu reseña:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Tu reseña (al menos 15 palabras)"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Text style={styles.label}>Calificación (1 a 5):</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Calificación"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <Button title="Enviar Reseña" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
