// /app/home.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  // Función para manejar la navegación a la búsqueda de cervezas
  const goToBeerSearch = () => {
    router.push('/beer-search');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la Cervecería</Text>
      <Text style={styles.subtitle}>Explora nuestras funcionalidades:</Text>

      {/* Botón para navegar a la búsqueda de cervezas */}
      <Button
        title="Buscar Cervezas"
        onPress={goToBeerSearch}
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
