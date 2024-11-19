import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../constants/config';

const UploadEventPicture = ({ eventId, token }) => {
  const [description, setDescription] = useState('');
  const [handles, setHandles] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Solicita permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos denegados', 'Se necesitan permisos para acceder a la galería.');
      return;
    }
  
    // Abre la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Cambiado a MediaTypeOptions.Images
      allowsEditing: true, // Permite editar la imagen antes de seleccionarla
      aspect: [4, 3], // Proporción de la imagen
      quality: 1, // Calidad de la imagen
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('Imagen seleccionada:', result.assets[0].uri);
    }
  };
  
  
  const uploadPicture = async () => {
    if (!image || !description) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
    formData.append('description', description);
    formData.append('tagged_handles', handles.split(',').map(handle => handle.trim()));

    try {
      const response = await fetch(`${API_URL}/api/v1/events/${eventId}/add_picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen.');
      }

      Alert.alert('Éxito', 'Imagen subida con éxito.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Imagen del Evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Handles (separados por comas)"
        value={handles}
        onChangeText={setHandles}
      />
      <Button title="Seleccionar Imagen" onPress={pickImage} />
      {image && <Text style={styles.imagePath}>Imagen seleccionada: {image}</Text>}
      <Button title="Subir Imagen" onPress={uploadPicture} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imagePath: {
    fontSize: 14,
    marginVertical: 10,
  },
});

export default UploadEventPicture;
