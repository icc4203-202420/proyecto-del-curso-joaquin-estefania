// /app/beer-details/[id].js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ReviewForm from '../../components/ReviewForm';
import axios from 'axios';
import { useSession } from '../../hooks/useSession';
import { API_URL } from '../../constants/config';

export default function BeerDetails() {
  const { id } = useLocalSearchParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false); // Estado para el spinner de envío
  const { token, user } = useSession();

  // Función para obtener los detalles de la cerveza
  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/beers/${id}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la cerveza');
        const data = await response.json();
        setBeer(data.beer);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron obtener los detalles de la cerveza');
        console.error('Error fetching beer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBeerDetails();
    }
  }, [id]);

  const onSubmitReview = async (review) => {
    if (!token || !user?.id) {
      Alert.alert('Error', 'Debe iniciar sesión para enviar una reseña');
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }

    if (!review.text || !review.rating) {
      Alert.alert('Error', 'Debe completar todos los campos para enviar la reseña');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/beers/${id}/reviews`,
        {
          review: {
            text: review.text,
            rating: review.rating,
            user_id: user.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Éxito', 'Reseña enviada correctamente');
      console.log('Review submitted:', response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la reseña');
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!beer) {
    return <Text style={styles.error}>Cerveza no encontrada</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.detail}>Estilo: {beer.style}</Text>
      <Text style={styles.detail}>Lúpulo: {beer.hop}</Text>
      <Text style={styles.detail}>Levadura: {beer.yeast}</Text>
      <Text style={styles.detail}>Malta: {beer.malts}</Text>
      <Text style={styles.detail}>IBU: {beer.ibu}</Text>
      <Text style={styles.detail}>Alcohol: {beer.alcohol}</Text>
      <Text style={styles.detail}>BLG: {beer.blg}</Text>
      <Text style={styles.detail}>
        Calificación promedio: {beer.avg_rating ? beer.avg_rating : 'No disponible'}
      </Text>

      {/* Componente para escribir reseñas */}
      <ReviewForm onSubmitReview={onSubmitReview} submitting={submittingReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
