// /app/beer-search/index.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/config';

export default function BeerSearch() {
  const [query, setQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const router = useRouter();

  // Función para manejar la búsqueda de cervezas por nombre
  const handleSearch = async () => {
    try {
      // Realiza una solicitud al backend para buscar cervezas por nombre
      const response = await fetch(`${API_URL}/api/v1/beers?search=${query}`);
      const data = await response.json();
      setBeers(data.beers); // Asigna las cervezas encontradas a tu estado
    } catch (error) {
      console.error('Error searching for beers:', error);
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
