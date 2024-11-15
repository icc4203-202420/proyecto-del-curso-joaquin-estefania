// /app/beer-search/reviews/[id].js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../../../constants/config';
import { useSession } from '../../../hooks/useSession';

export default function BeerReviews() {
  const { id } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/beers/${id}/reviews`, {
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
        setReviews(data.reviews || []); // Asegúrate de que el backend devuelva un array de reseñas
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las reseñas.');
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reseñas de la cerveza</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewText}>{item.text}</Text>
              <Text style={styles.reviewRating}>Calificación: {item.rating}</Text>
              <Text style={styles.reviewUser}>Por: {item.user?.name || 'Anónimo'}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReviews}>No hay reseñas para esta cerveza.</Text>
      )}
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
    marginBottom: 10,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  reviewUser: {
    fontSize: 14,
    color: 'gray',
  },
  noReviews: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
});
