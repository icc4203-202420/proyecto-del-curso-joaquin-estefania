// /app/home.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la Cervecería</Text>
      <Text style={styles.subtitle}>Explora nuestras funcionalidades:</Text>

      <Button
        title="Buscar Cervezas"
        onPress={() => router.push('/search-beer')}
      />
      <Button
        title="Evaluar Cervezas"
        onPress={() => router.push('/review-beer')}
        style={styles.button}
      />
      <Button
        title="Ver Evaluaciones"
        onPress={() => router.push('/beer-reviews')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});
