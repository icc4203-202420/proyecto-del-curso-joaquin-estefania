// hooks/notifications.js
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';

// Función para registrar el push token en el backend
export async function registerPushToken() {
  const token = await SecureStore.getItemAsync('authToken');
  if (!token) return;

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
}

// Listeners de notificaciones
export function setupNotificationListeners(router) {
  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    const { title, body } = notification.request.content;
    alert(`${title}\n${body}`);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const { data } = response.notification.request.content;
    if (data?.targetScreen) {
      router.push(data.targetScreen);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}
