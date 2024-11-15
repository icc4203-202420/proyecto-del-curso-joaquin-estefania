// /app/beer-search/index.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/config';
import * as SecureStore from 'expo-secure-store';

export default function BeerSearch() {
  const [query, setQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const router = useRouter();

  // Función para obtener el token de Secure Storage
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      return token;
    } catch (error) {
      console.error('Error retrieving token from SecureStore:', error);
      return null;
    }
  };

  // Función para manejar la búsqueda de cervezas
  const handleSearch = async () => {
    const token = await getToken();

    if (!token) {
      Alert.alert('Error', 'No se encontró un token. Por favor, inicia sesión.');
      return;
    }

    try {
      // Realiza una solicitud al backend para buscar cervezas
      const response = await fetch(`${API_URL}/api/v1/beers?search=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBeers(data.beers || []); // Asigna las cervezas encontradas al estado
    } catch (error) {
      console.error('Error searching for beers:', error);
      Alert.alert('Error', 'No se pudo buscar cervezas. Por favor, intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar cerveza por nombre..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {/* Muestra los resultados de la búsqueda */}
      <FlatList
        data={beers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/beer-search/${item.id}`)}>
            <Text style={styles.beerItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  beerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
