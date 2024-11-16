import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  // Función para manejar la navegación a la búsqueda de cervezas
  const goToBeerSearch = () => {
    router.push('/beer-search'); // Navega a la pantalla de búsqueda de cervezas
  };

  // Función para manejar la navegación a la búsqueda de usuarios
  const goToUserSearch = () => {
    router.push('/user-search'); // Navega a la pantalla de búsqueda de usuarios
  };

  // Función para manejar la navegación a los detalles de un bar específico
  const goToBarsList = () => {
    router.push('/bars'); // Navega a la lista de bares
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la Cervecería 🍻</Text>
      <Text style={styles.subtitle}>Explora nuestras funcionalidades:</Text>

      {/* Botón para navegar a la búsqueda de cervezas */}
      <TouchableOpacity style={styles.button} onPress={goToBeerSearch}>
        <Text style={styles.buttonText}>Buscar Cervezas</Text>
      </TouchableOpacity>

      {/* Botón para navegar a la búsqueda de usuarios */}
      <TouchableOpacity style={styles.button} onPress={goToUserSearch}>
        <Text style={styles.buttonText}>Buscar Usuarios</Text>
      </TouchableOpacity>

      {/* Botón para navegar a la lista de bares */}
      <TouchableOpacity style={styles.button} onPress={goToBarsList}>
        <Text style={styles.buttonText}>Lista de Bares</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Fondo claro
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde agradable
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Verde atractivo
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%', // Botones más grandes
    alignItems: 'center',
    shadowColor: '#000', // Sombra para mayor efecto
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra en Android
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: '600',
  },
});
