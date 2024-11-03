// /app/signup.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { first_name: firstName, last_name: lastName, email, password, handle },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al registrar');
        return;
      }

      const data = await response.json();
      // Redirigir al usuario a la pantalla de login o home
      router.push('/login');
    } catch (err) {
      setError('Error de red o del servidor');
    }
  };

  // Maneja la navegación a la pantalla de login
  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Handle"
        value={handle}
        onChangeText={setHandle}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
      <View style={{ height: 10 }} />
      <Button title="Already have an account? Login" onPress={handleGoToLogin} />
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
