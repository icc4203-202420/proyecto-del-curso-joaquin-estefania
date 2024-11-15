import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchUsers = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) {
      Alert.alert('Error', 'Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/users/search?handle=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al buscar usuarios.');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda.');
      console.error(error);
    }
  };

  const addFriend = async (friendId, barId = null, eventId = null) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) {
      Alert.alert('Error', 'Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/friendships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_id: friendId, bar_id: barId, event_id: eventId }),
      });

      if (!response.ok) throw new Error('Error al agregar amigo.');

      const data = await response.json();
      Alert.alert('Éxito', data.message || 'Amigo agregado.');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al agregar amigo.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar usuario por handle..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={searchUsers} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.handle}</Text>
            <Button title="Agregar" onPress={() => addFriend(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No se encontraron usuarios.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
