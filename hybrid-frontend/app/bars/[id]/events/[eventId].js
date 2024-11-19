import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../../../constants/config';
import { useSession } from '../../../../hooks/useSession';

const EventDetails = () => {
  const { id, eventId } = useLocalSearchParams(); // Obteniendo `id` del bar y `eventId` del evento
  const { token } = useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/events/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los detalles del evento.');
      }

      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/events/${eventId}/attend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al hacer check-in.');
      }
  
      const data = await response.json();
  
      Alert.alert(
        'Éxito',
        'Te has registrado en el evento y se ha notificado a tus amigos.'
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontraron detalles para este evento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}>Descripción: {event.description || 'No disponible'}</Text>
      <Text style={styles.detail}>
        Fecha: {event.date ? new Date(event.date).toLocaleDateString() : 'No disponible'}
      </Text>
      {event.start_date && event.end_date && (
        <Text style={styles.detail}>
          Duración: {new Date(event.start_date).toLocaleDateString()} -{' '}
          {new Date(event.end_date).toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.detail}>Bar: {event.bar?.name || 'Bar no especificado'}</Text>

      {/* Botón para hacer check-in */}
      <Button title="Asistir" onPress={handleCheckIn} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default EventDetails;
