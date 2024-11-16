import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/config';
import { useSession } from '../../hooks/useSession';

const BarsIndex = () => {
  const { token } = useSession();
  const router = useRouter();
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBars = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/bars`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los bares.');
      }

      const data = await response.json();
      setBars(data.bars);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBars();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.barItem}>
            <Text style={styles.barName}>{item.name}</Text>
            <Button
              title="Ver eventos"
              onPress={() => router.push(`/bars/${item.id}/events`)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noBars}>No hay bares disponibles.</Text>}
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
  barItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  barName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noBars: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default BarsIndex;
