// /app/beer-details/[id].js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ReviewForm from '../../components/ReviewForm';
import axios from 'axios';
import { useSession } from '../../hooks/useSession';

export default function BeerDetails() {
  const { id } = useLocalSearchParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSession(); // Obtén el usuario y el token

  // Función para obtener los detalles de la cerveza
  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/beers/${id}`);
        const data = await response.json();
        setBeer(data.beer);
      } catch (error) {
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
      console.error('Usuario no autenticado o ID de usuario no disponible');
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/beers/${id}/reviews`,
        {
          review: {
            text: review.text,
            rating: review.rating,
            user_id: user.id, // Usa el ID del usuario
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
          },
        }
      );
      console.log('Review submitted:', response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
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
      <ReviewForm onSubmitReview={onSubmitReview} />
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
