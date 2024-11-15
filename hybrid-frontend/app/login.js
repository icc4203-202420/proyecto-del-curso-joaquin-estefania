// /app/login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../hooks/useSession';
import { Platform } from 'react-native';
import { API_URL as CONFIG_API_URL } from '../constants/config'; // Importamos la URL global

// Ajustar API_URL dependiendo del entorno
const API_URL = Platform.OS === 'web' ? 'http://localhost:3001' : CONFIG_API_URL;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useSession(); // Hook personalizado para manejar la sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al iniciar sesión');
        return;
      }

      const data = await response.json();

      // Asegúrate de que estas claves coincidan con la estructura de tu respuesta del backend
      const user = data.user; // Ajusta según la clave exacta en tu respuesta JSON
      const token = data.token; // Ajusta según la clave exacta en tu respuesta JSON

      console.log('User Data:', user);

      // Establece la sesión y redirige al usuario a la pantalla principal
      login(user, token);
      router.push('/home');
    } catch (err) {
      setError('Error de red o del servidor');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
