// /app/login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '../hooks/useSession'; // Importa useSession

export default function LoginForm() {
  const router = useRouter();
  const { login } = useSession(); // Usa el hook para obtener la función de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoToSignUp = () => {
    router.push('/signup');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al iniciar sesión');
        return;
      }

      // Llama a login() para cambiar el estado a autenticado
      login();

      // Redirige al usuario a la pantalla principal
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
      <View style={{ height: 10 }} />
      <Button title="Create Account" onPress={handleGoToSignUp} />
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
