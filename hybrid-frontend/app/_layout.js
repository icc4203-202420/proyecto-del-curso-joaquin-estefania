// /app/_layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';

export default function AppLayout() {
  const router = useRouter();

  // Aquí puedes agregar lógica para el manejo de navegación o autenticación en el futuro

  // Ejemplo: Muestra la Navbar de forma condicional
  const isAuthenticated = true; //Cambiar esto más adelante cuando integres Redux o autenticación

  const handleLogout = () => {
    // Lógica de logout que puedes implementar más adelante
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
