import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importar ambos hooks
import { API_URL } from '../../../../constants/config';
import { useSession } from '../../../../hooks/useSession';

const EventsIndex = () => {
  const { id } = useLocalSearchParams(); // Accede al parámetro dinámico 'id' de la ruta
  const router = useRouter(); // Necesario para navegar
  const { token } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/bars/${id}/events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los eventos.');
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvents();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Button
              title="Detalles"
              onPress={() => router.push(`/bars/${id}/events/${item.id}`)} // Navega a los detalles del evento
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No hay eventos disponibles.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default EventsIndex;
