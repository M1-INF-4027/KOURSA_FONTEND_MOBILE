import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { authService } from '../api/services';

/**
 * Demande la permission de recevoir des notifications push.
 * Sur Android 13+, demande explicitement POST_NOTIFICATIONS.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return false;
      }
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Firebase messaging permission denied');
    }
    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Recupere le token FCM du device et l'envoie au backend.
 */
export async function registerDeviceToken(): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await authService.registerFcmToken(fcmToken);
      console.log('FCM token registered:', fcmToken.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('Error registering FCM token:', error);
  }
}

/**
 * Ecoute le rafraichissement du token FCM (quand Firebase en genere un nouveau).
 */
export function onTokenRefresh(callback?: () => void): () => void {
  return messaging().onTokenRefresh(async (newToken) => {
    try {
      await authService.registerFcmToken(newToken);
      console.log('FCM token refreshed and registered');
      callback?.();
    } catch (error) {
      console.error('Error registering refreshed FCM token:', error);
    }
  });
}

/**
 * Configure le handler pour les messages recus en arriere-plan.
 * Doit etre appele au top-level (index.js) en dehors du composant React.
 */
export function setBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message received:', remoteMessage.notification?.title);
  });
}
