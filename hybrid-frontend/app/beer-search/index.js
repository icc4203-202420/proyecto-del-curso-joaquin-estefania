import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/config';
import * as SecureStore from 'expo-secure-store';

export default function BeerSearch() {
  const [query, setQuery] = useState('');
  const [allBeers, setAllBeers] = useState([]); // Estado para todas las cervezas
  const [filteredBeers, setFilteredBeers] = useState([]); // Estado para cervezas filtradas
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const router = useRouter();

  // Obtener token desde Secure Store
  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  // Función para cargar todas las cervezas al iniciar
  const fetchAllBeers = async () => {
    const token = await getToken();

    if (!token) {
      Alert.alert('Error', 'Por favor, inicia sesión para cargar las cervezas.');
      return;
    }

    setLoading(true); // Muestra el spinner
    try {
      const response = await fetch(`${API_URL}/api/v1/beers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAllBeers(data.beers || []); // Guarda todas las cervezas en el estado
      setFilteredBeers(data.beers || []); // Inicialmente, las filtradas son todas
    } catch (error) {
      console.error('Error fetching beers:', error);
      Alert.alert('Error', 'Hubo un problema al cargar las cervezas.');
    } finally {
      setLoading(false); // Oculta el spinner
    }
  };

  // Actualiza las cervezas filtradas cuando el usuario escribe
  useEffect(() => {
    const results = allBeers.filter((beer) =>
      beer.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBeers(results);
  }, [query, allBeers]);

  // Cargar todas las cervezas al montar el componente
  useEffect(() => {
    fetchAllBeers();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar cerveza por nombre..."
        value={query}
        onChangeText={setQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredBeers} // Usar las cervezas filtradas
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/beer-details/${item.id}`)}>
              <Text style={styles.beerItem}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>No se encontraron cervezas.</Text>
          }
        />
      )}
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
  noResults: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
});
