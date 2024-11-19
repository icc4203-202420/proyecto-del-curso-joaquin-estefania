// app/_layout.js
import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { useRouter } from 'expo-router';
import { AuthProvider, useSession } from '../hooks/useSession';

function AppContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useSession();

  const handleLogout = async () => {
    logout();
    router.push('/login');
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
