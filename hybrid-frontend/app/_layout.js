// /app/_layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';
import { AuthProvider, useSession } from '../hooks/useSession'; // Importa AuthProvider y useSession

function AppContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useSession(); // Usa el hook para obtener la sesión y la función de logout

  // Función para manejar el logout
  const handleLogout = () => {
    logout(); // Cierra sesión
    router.push('/login'); // Redirige a la pantalla de login
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

export default function AppLayout() {
  return (
    <AuthProvider> {/* Envuelve AppContent en AuthProvider */}
      <AppContent />
    </AuthProvider>
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
