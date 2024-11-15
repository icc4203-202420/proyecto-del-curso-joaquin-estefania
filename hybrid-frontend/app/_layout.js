import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';
import { AuthProvider, useSession } from '../hooks/useSession';
import * as SecureStore from 'expo-secure-store';

function AppContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useSession();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken'); // Elimina el token almacenado
      console.log('Token eliminado de SecureStore');
      logout(); // Cierra sesión en el contexto
      router.push('/login'); // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <View style={styles.content}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

export default function AppLayout() {
  return (
    <AuthProvider>
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
