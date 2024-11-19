//hybrid-frontend/utils/notifications.js

import * as Notifications from 'expo-notifications';
import { API_URL } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

// Función para registrar el push token en el backend
export const registerPushToken = async () => {
  const token = await SecureStore.getItemAsync('authToken');
  if (!token) {
    console.log('No se encontró el token en SecureStore');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('No se obtuvo permiso para notificaciones.');
    return;
  }

  const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push Token obtenido:', pushToken);

  try {
    await fetch(`${API_URL}/api/v1/users/push_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ push_token: pushToken }),
    });
    console.log('Push token registrado exitosamente.');
  } catch (error) {
    console.error('Error al registrar el push token:', error);
  }
};

// Función para enviar notificación
export const sendPushNotification = async ({ to, title, body, data = {} }) => {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        title,
        body,
        data,
      }),
    });
    const result = await response.json();
    console.log('Notificación enviada:', result);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};
