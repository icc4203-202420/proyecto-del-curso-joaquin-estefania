import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../../../constants/config';
import { useSession } from '../../../../hooks/useSession';
import UploadEventPicture from '../../../../components/UploadEventPicture'; // Importa el formulario de subida de imágenes

const EventDetails = () => {
  const { id, eventId } = useLocalSearchParams(); // Obteniendo `id` del bar y `eventId` del evento
  const { token } = useSession();
  const [event, setEvent] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingPictures, setLoadingPictures] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchEventPictures();
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
      setLoadingEvent(false);
    }
  };

  const fetchEventPictures = async () => {
    setLoadingPictures(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/events/${eventId}/pictures`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las imágenes del evento.');
      }

      const data = await response.json();
      setPictures(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoadingPictures(false);
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

      Alert.alert('Éxito', 'Te has registrado en el evento y se ha notificado a tus amigos.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loadingEvent) {
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

      {/* Formulario de subida de imágenes */}
      <UploadEventPicture eventId={eventId} token={token} />

      {/* Mostrar imágenes del evento */}
      <Text style={styles.sectionTitle}>Imágenes del Evento</Text>
      {loadingPictures ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : pictures.length === 0 ? (
        <Text style={styles.noPicturesText}>No hay imágenes para este evento.</Text>
      ) : (
        <FlatList
          data={pictures}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pictureCard}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.meta}>
                Subido por: {item.user.first_name} {item.user.last_name}
              </Text>
              {item.tagged_handles && Array.isArray(item.tagged_handles) && item.tagged_handles.length > 0 ? (
                <Text style={styles.meta}>
                  Etiquetados: {item.tagged_handles.join(', ')}
                </Text>
              ) : (
                <Text style={styles.meta}>Sin usuarios etiquetados</Text>
              )}
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noPicturesText: {
    fontSize: 16,
    color: 'gray',
  },
  list: {
    paddingTop: 10,
  },
  pictureCard: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default EventDetails;
