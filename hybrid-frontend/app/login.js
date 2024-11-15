// /app/login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../hooks/useSession';
import { API_URL as CONFIG_API_URL } from '../constants/config'; // Importamos la URL global
import * as SecureStore from 'expo-secure-store'; // Importar Secure Storage

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
  
      // Imprime la respuesta completa para verificar la estructura
      console.log('Respuesta del backend:', data);
  
      // Ajusta según la estructura de la respuesta
      const user = data.status?.data?.user; // Accede al usuario anidado
      const token = data.status?.data?.token; // Accede al token anidado
  
      if (token) {
        await SecureStore.setItemAsync('authToken', token); // Guarda el token de forma segura
        console.log('Token almacenado en SecureStore');
        login(user, token); // Actualiza el contexto de sesión
        router.push('/home'); // Navega a la página principal
      } else {
        throw new Error('No se recibió un token en la respuesta');
      }
    } catch (err) {
      setError('Error de red o del servidor');
      console.error('Error durante el login:', err);
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
